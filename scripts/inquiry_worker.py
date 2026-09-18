#!/usr/bin/env python3
"""One bounded maintenance pass. Run on an approved host with current ClamAV.
No scheduler is installed by this script. No credentials or customer fields are logged.
"""
import datetime as dt
import hashlib
import io
import json
import os
import pathlib
import subprocess
import tempfile
import urllib.error
import urllib.request
import zipfile

MAX_FILE = 20 * 1024 * 1024
MIME = {'jpg':'image/jpeg','jpeg':'image/jpeg','png':'image/png','webp':'image/webp','pdf':'application/pdf','txt':'text/plain','csv':'text/csv','docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation'}

def validate_file(data, ext):
    if not data or len(data)>MAX_FILE or ext not in MIME:
        return False
    if ext in ('jpg','jpeg'): return data.startswith(b'\xff\xd8\xff')
    if ext == 'png': return data.startswith(b'\x89PNG\r\n\x1a\n')
    if ext == 'webp': return data[:4]==b'RIFF' and data[8:12]==b'WEBP'
    if ext == 'pdf': return data.startswith(b'%PDF-')
    if ext in ('txt','csv'):
        try: text = data.decode('utf-8-sig')
        except UnicodeDecodeError: return False
        return not any(ord(c)<32 and c not in '\t\n\r' for c in text)
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as z:
            infos=z.infolist();names={f.filename for f in infos}
            target={'docx':'word/document.xml','xlsx':'xl/workbook.xml','pptx':'ppt/presentation.xml'}[ext]
            if target not in names or '[Content_Types].xml' not in names: return False
            if len(infos)>5000 or sum(f.file_size for f in infos)>100*1024*1024: return False
            if any('vbaproject' in f.filename.lower() or f.flag_bits&1 or '..' in pathlib.PurePosixPath(f.filename).parts or f.filename.startswith('/') for f in infos): return False
            return True
    except (zipfile.BadZipFile,KeyError): return False

def scan_file(data, ext):
    if not validate_file(data, ext): return 'rejected'
    with tempfile.TemporaryDirectory(prefix='seekapi-scan-') as directory:
        path=pathlib.Path(directory)/('upload.'+ext);path.write_bytes(data)
        r=subprocess.run(['clamscan','--no-summary','--infected','--max-filesize=25M','--max-scansize=150M','--alert-exceeds-max=yes','--alert-encrypted=yes','--',str(path)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,timeout=90)
        if r.returncode==0: return 'clean'
        if r.returncode==1: return 'rejected'
        raise RuntimeError('scanner unavailable')

def api(path,method='GET',body=None,raw=False,mime='application/json'):
    base=os.environ['INQUIRY_SUPABASE_URL'];key=os.environ['INQUIRY_SUPABASE_SERVICE_ROLE_KEY']
    payload=body if isinstance(body,bytes) else json.dumps(body).encode() if body is not None else None
    request=urllib.request.Request(base+path,data=payload,method=method,headers={'apikey':key,'Authorization':'Bearer '+key,'Content-Type':mime})
    with urllib.request.urlopen(request,timeout=45) as response:
        data=response.read(MAX_FILE+1 if raw else 5*1024*1024)
        if raw: return data
        return json.loads(data) if data else None

def delete_objects(bucket,paths):
    if paths: api('/storage/v1/object/'+bucket,'DELETE',{'prefixes':paths})

def now(): return dt.datetime.now(dt.timezone.utc)

def tick_headers():
    headers={'Authorization':'Bearer '+os.environ['INQUIRY_WORKER_TOKEN'],'Content-Type':'application/json'}
    bypass=os.environ.get('INQUIRY_VERCEL_AUTOMATION_BYPASS_SECRET','').strip()
    if bypass:
        headers['x-vercel-protection-bypass']=bypass
    return headers

def maintenance():
    # Require a successful scan, including signature DB availability, before heartbeat.
    if scan_file(b'SeekAPI scanner health check\n','txt')!='clean': raise RuntimeError('scanner health')
    attachments=api('/rest/v1/inquiry_attachments?scan_status=eq.pending&limit=10&select=*')
    for a in attachments:
        data=api('/storage/v1/object/authenticated/inquiry-quarantine/'+a['object_path'],raw=True)
        status=scan_file(data,a['extension']) if len(data)==a['expected_size'] else 'rejected'
        update={'scan_status':status,'scan_at':now().isoformat()}
        if status=='clean':
            digest=hashlib.sha256(data).hexdigest()
            path=a['inquiry_id']+'/'+a['id']+'/'+digest+'.'+a['extension']
            try: api('/storage/v1/object/inquiry-clean/'+path,'POST',data,mime=MIME[a['extension']])
            except urllib.error.HTTPError as e:
                # Retry after upload/DB-write interruption: verify immutable content.
                if e.code not in (400,409): raise
                existing=api('/storage/v1/object/authenticated/inquiry-clean/'+path,raw=True)
                if hashlib.sha256(existing).hexdigest()!=digest: raise RuntimeError('integrity check')
            update.update(clean_path=path,sha256=digest)
        api('/rest/v1/inquiry_attachments?id=eq.'+a['id'],'PATCH',update)

    # Draft upload tokens last 2h. Do not remove raw objects while replay is possible.
    expired=api('/rest/v1/inquiry_drafts?expires_at=lt.'+now().isoformat()+'&limit=50&select=id,files')
    for d in expired:
        remaining=api('/rest/v1/inquiry_attachments?inquiry_id=eq.'+d['id']+'&scan_status=eq.pending&select=id')
        if remaining: continue
        delete_objects('inquiry-quarantine',[f['path'] for f in d['files']])
        api('/rest/v1/inquiry_drafts?id=eq.'+d['id'],'DELETE')

    # Requests for deletion are held 24h, ensuring draft upload tokens have expired.
    cutoff=(now()-dt.timedelta(hours=24)).isoformat()
    retention=(now()-dt.timedelta(days=365)).isoformat()
    doomed=api('/rest/v1/inquiries?or=(deletion_requested_at.lt.'+cutoff+',and(status.in.(closed,spam),updated_at.lt.'+retention+'))&limit=30&select=id')
    for i in doomed:
        rows=api('/rest/v1/inquiry_attachments?inquiry_id=eq.'+i['id']+'&select=object_path,clean_path')
        delete_objects('inquiry-quarantine',[a['object_path'] for a in rows])
        delete_objects('inquiry-clean',[a['clean_path'] for a in rows if a['clean_path']])
        api('/rest/v1/inquiry_drafts?id=eq.'+i['id'],'DELETE')
        api('/rest/v1/inquiries?id=eq.'+i['id'],'DELETE')
    api('/rest/v1/inquiry_rate_limits?window_start=lt.'+cutoff,'DELETE')
    # Upsert heartbeat through REST with explicit merge preference.
    existing=api('/rest/v1/inquiry_worker_health?select=id')
    api('/rest/v1/inquiry_worker_health'+('?id=eq.true' if existing else ''),'PATCH' if existing else 'POST',{'id':True,'last_ok':now().isoformat()})
    request=urllib.request.Request(os.environ['INQUIRY_SITE_URL']+'/api/internal/inquiries/tick',data=b'{}',method='POST',headers=tick_headers())
    with urllib.request.urlopen(request,timeout=60) as response:
        if response.status!=200: raise RuntimeError('mail maintenance')

if __name__=='__main__':
    try:
        maintenance()
        print('Inquiry maintenance pass completed')
    except Exception:
        print('Inquiry maintenance failed; files remain quarantined. Inspect provider status securely.')
        raise SystemExit(1)
