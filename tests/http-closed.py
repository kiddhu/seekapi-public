"""Outside-in HTTP checks against a built site with intake deliberately disabled."""
import os
import subprocess
import time
import socket
import urllib.request
import urllib.error

server=subprocess.Popen(['node','node_modules/next/dist/bin/next','start','--port','3017'],env={**os.environ,'INQUIRIES_ENABLED':'0'},stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
    base='http://127.0.0.1:3017'
    deadline=time.monotonic()+20
    while time.monotonic()<deadline:
        try:
            socket.create_connection(('127.0.0.1',3017),timeout=1).close()
            break
        except OSError: time.sleep(.1)
    checks=[('/api/admin/inquiries','GET',401),('/api/admin/inquiries/00000000-0000-4000-8000-000000000000','GET',401),('/api/inquiries/draft','POST',503),('/api/inquiries/finalize','POST',503)]
    for path,method,expected in checks:
        req=urllib.request.Request(base+path,method=method,data=b'{}' if method=='POST' else None,headers={'Content-Type':'application/json'})
        try: code=opener.open(req,timeout=15).status
        except urllib.error.HTTPError as e: code=e.code
        assert code==expected,(path,code,expected)
        print(method,path,code,'PASS')
    for path in ['/start','/ja/start','/es/start','/ar/start','/de/start','/pt-br/start','/ru/start','/admin/inquiries','/inquiry-privacy']:
        with opener.open(base+path,timeout=15) as r:
            assert r.status==200
        print(path,'200 PASS')
finally:
    server.terminate()
    server.wait(timeout=10)
