#!/usr/bin/env python3
"""No-value Chromium acceptance against a local production-mode build.

Requires Python Playwright, system Chromium, and an explicit axe-core 4.10.3 JS
file. No external requests or upstream payment/order/provider calls are allowed.
Evidence is written to a new directory; prior runs are never overwritten.
"""
import argparse
import datetime
import hashlib
import json
import pathlib
import subprocess
import sys
import urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

WIDTHS = [(360,800),(375,812),(390,844),(430,932),(768,1024),(1024,900),(1440,1000)]
ROUTES = ['/', '/china-supply-check', '/china-supply-check/live-rfq-compare',
          '/proof', '/trust', '/support', '/for-agents', '/start?audience=company']
LOCALES = ['es','de','ja','ar','pt-br','ru']
SCRIPTS = """
window.qaMetrics={shifts:[],lcp:null};
new PerformanceObserver(list=>list.getEntries().forEach(e=>{
 if(!e.hadRecentInput)qaMetrics.shifts.push(e.value);
})).observe({type:'layout-shift',buffered:true});
new PerformanceObserver(list=>{for(const e of list.getEntries())qaMetrics.lcp=e.startTime;})
 .observe({type:'largest-contentful-paint',buffered:true});
"""

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url',default='http://127.0.0.1:3000')
    parser.add_argument('--evidence-dir',required=True)
    parser.add_argument('--axe',required=True)
    parser.add_argument('--chromium',default='/usr/bin/chromium')
    parser.add_argument('--sitemap-sweep',action='store_true',help='Also inspect other public sitemap pages at 360 and 1440px')
    args=parser.parse_args()
    origin=args.base_url.rstrip('/')
    if urlsplit(origin).hostname not in ['127.0.0.1','localhost','::1']:
        parser.error('Use a loopback build; this suite deliberately submits local synthetic forms.')
    out=pathlib.Path(args.evidence_dir)
    out.mkdir(parents=True,exist_ok=False)
    axe=pathlib.Path(args.axe).resolve()
    results={'started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),
             'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),
             'dirty':bool(subprocess.check_output(['git','status','--porcelain'],text=True)),
             'axe_sha256':hashlib.sha256(axe.read_bytes()).hexdigest(),
             'scope':'LOCAL_PRODUCTION_BUILD_SYNTHETIC_NO_VALUE_NOT_RUM',
             'screens':[],'checks':[],'errors':[],'external_requests':[]}

    def check(name,condition,detail=None):
        results['checks'].append({'name':name,'pass':bool(condition),'detail':detail})
        if not condition: results['errors'].append({'name':name,'detail':detail})

    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox'])
            results['chromium']=browser.version

            def context(**kwargs):
                c=browser.new_context(extra_http_headers={'DNT':'1','Sec-GPC':'1','x-seekapi-measurement-test':'1'},**kwargs)
                def route(r):
                    if not r.request.url.startswith(origin+'/'):
                        results['external_requests'].append({'host':urlsplit(r.request.url).netloc,'method':r.request.method})
                        r.abort()
                    elif r.request.method not in ['GET','HEAD']:
                        results['errors'].append({'name':'Unexpected local mutation','path':urlsplit(r.request.url).path})
                        r.abort()
                    else: r.continue_()
                c.route('**/*',route)
                c.add_init_script("Object.defineProperty(Navigator.prototype,'doNotTrack',{get:()=> '1'}); Object.defineProperty(Navigator.prototype,'globalPrivacyControl',{get:()=>true});")
                return c

            for width,height in WIDTHS:
                for path in ROUTES:
                    c=context(viewport={'width':width,'height':height})
                    page=c.new_page()
                    page.add_init_script(SCRIPTS)
                    console=[]
                    page.on('pageerror',lambda e:console.append(str(e)))
                    response=page.goto(origin+path,wait_until='networkidle')
                    page.wait_for_timeout(250)
                    data=page.evaluate("""()=>({
                      width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
                      cls:qaMetrics.shifts.reduce((a,b)=>a+b,0),lcp:qaMetrics.lcp,
                      h1:document.querySelectorAll('h1').length,
                      canonical:document.querySelector('link[rel=canonical]')?.href,
                      targets:[...document.querySelectorAll('main .button,.menu-button')].filter(e=>e.getClientRects().length).map(e=>({text:e.innerText,height:e.getBoundingClientRect().height})),
                      homeActions:[...document.querySelectorAll('.main-actions a')].map(e=>({text:e.innerText,href:e.getAttribute('href'),...e.getBoundingClientRect().toJSON()}))
                    })""")
                    label=f'{path}@{width}'
                    check(label+' HTTP',response.status==200,response.status)
                    check(label+' overflow',data['scrollWidth']<=width+1,data['scrollWidth'])
                    check(label+' H1',data['h1']==1,data['h1'])
                    check(label+' CLS',data['cls']<=0.1,data['cls'])
                    check(label+' console',not console,console)
                    check(label+' targets',all(t['height']>=47.9 for t in data['targets']),[t for t in data['targets'] if t['height']<47.9])
                    expected='https://seekapi.ai'+('/' if path=='/' else path.split('?')[0])
                    check(label+' canonical',data['canonical']==expected,data['canonical'])
                    if path=='/':
                        actions=data['homeActions']
                        check(label+' dual first screen',len(actions)==2 and all(a['top']>=0 and a['bottom']<=height for a in actions),actions)
                    if width in [390,1440]:
                        page.add_script_tag(path=str(axe))
                        audit=page.evaluate("""async()=>{
                          const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});
                          return {version:axe.version,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};
                        }""")
                        check(label+' axe',not audit['violations'],audit)
                        data['axe']=audit
                    name=('home' if path=='/' else path.split('?')[0].strip('/').replace('/','-'))+f'-{width}.png'
                    page.screenshot(path=str(out/name))
                    data.update({'route':path,'viewport':{'width':width,'height':height},'screenshot':name})
                    results['screens'].append(data)
                    c.close()
                print(f'Completed {width}px core pages',flush=True)

            for locale in LOCALES:
                for width,height in [(390,844),(1440,1000)]:
                    c=context(viewport={'width':width,'height':height})
                    page=c.new_page();page.goto(origin+'/'+locale,wait_until='networkidle')
                    page.add_script_tag(path=str(axe))
                    audit=page.evaluate("""async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));}""")
                    check(f'{locale}@{width} axe',not audit,audit)
                    check(f'{locale}@{width} overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
                    check(f'{locale}@{width} direction',page.locator('html').get_attribute('dir')==('rtl' if locale=='ar' else 'ltr'))
                    page.screenshot(path=str(out/f'{locale}-{width}.png'))
                    c.close()
            print('Completed localized pages',flush=True)

            if args.sitemap_sweep:
                with urllib.request.urlopen(origin+'/sitemap.xml',timeout=20) as response:
                    urls=[e.text for e in ET.fromstring(response.read()).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
                covered={r.split('?')[0] for r in ROUTES}|{'/'+x for x in LOCALES}
                results['sitemap_sweep']=[]
                for url in urls:
                    path=urlsplit(url).path
                    if path in covered: continue
                    for width,height in [(360,800),(1440,1000)]:
                        c=context(viewport={'width':width,'height':height});page=c.new_page()
                        response=page.goto(origin+path,wait_until='networkidle')
                        label=f'sitemap {path}@{width}'
                        check(label+' HTTP',response.status==200,response.status)
                        check(label+' overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
                        check(label+' H1',page.locator('h1').count()==1)
                        check(label+' canonical',page.locator('link[rel=canonical]').get_attribute('href')==url)
                        row={'route':path,'width':width,'status':response.status}
                        if width==360:
                            page.add_script_tag(path=str(axe))
                            audit=page.evaluate("async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));}")
                            check(label+' axe',not audit,audit);row['axe']=audit
                            if audit: page.screenshot(path=str(out/('sweep-fail-'+path.strip('/').replace('/','-')+'.png')))
                        results['sitemap_sweep'].append(row);c.close()
                print(f"Completed {len(results['sitemap_sweep'])} additional public layouts",flush=True)

            # Keyboard disclosure, language submenu and focus restoration.
            c=context(viewport={'width':390,'height':844});page=c.new_page()
            page.goto(origin,wait_until='networkidle')
            page.keyboard.press('Tab')
            check('skip link is first',page.locator(':focus').inner_text()=='Skip to main content')
            page.keyboard.press('Enter')
            check('skip link reaches main',page.evaluate("document.activeElement?.id==='main-content'"))
            menu=page.locator('.menu-button')
            menu.focus();page.keyboard.press('Enter')
            check('menu opens',menu.get_attribute('aria-expanded')=='true')
            page.keyboard.press('Tab')
            check('menu keyboard first link',page.locator(':focus').inner_text()=='Find Suppliers')
            language=page.locator('.mobile-menu summary')
            language.focus();page.keyboard.press('Enter');page.keyboard.press('Escape')
            check('language Escape restores summary',page.locator(':focus').get_attribute('aria-label')=='Choose language')
            page.keyboard.press('Escape')
            check('menu Escape restores trigger',menu.get_attribute('aria-expanded')=='false' and menu.evaluate('(e)=>document.activeElement===e'))
            page.get_by_role('link',name='My results',exact=True).click();page.wait_for_url('**/support#existing-results')
            check('result anchor is focusable',page.locator('#existing-results').evaluate('(e)=>document.activeElement===e'))
            c.close()

            # 320px reflow approximates a 1280px viewport at 400% page zoom.
            c=context(viewport={'width':320,'height':800});page=c.new_page()
            for path in ROUTES:
                page.goto(origin+path,wait_until='networkidle')
                check(path+' 400% reflow equivalent',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
            c.close()

            # No-JS pages retain useful navigation. Email-draft controls cannot
            # fall back to a native GET that puts personal data into the URL.
            c=context(viewport={'width':390,'height':844},java_script_enabled=False);page=c.new_page()
            page.goto(origin,wait_until='load')
            check('no-JS home has both actions',page.locator('.main-actions a').count()==2)
            for path in ['/start?audience=company','/es/start','/ru/start']:
                page.goto(origin+path,wait_until='load')
                check(path+' no-JS fields disabled',all(not e.is_enabled() for e in page.locator('form input,form select,form textarea,form button').all()))
                check(path+' no-JS support fallback',page.locator('main noscript a[href="mailto:support@seekapi.ai"]').count()==1)
            c.close()

            # Correct invalid input, preserve mode drafts and invalidate stale mail.
            c=context(viewport={'width':390,'height':844});page=c.new_page()
            page.goto(origin+'/start?audience=company',wait_until='networkidle')
            page.get_by_role('button',name='Prepare email request',exact=True).click()
            check('invalid form focuses first field',page.locator('#organization').evaluate('(e)=>document.activeElement===e'))
            for field,value in {'organization':'INTERNAL_QA','role':'QA','country':'Netherlands','contact':'qa@example.invalid','issue':'Synthetic local draft only'}.items():
                page.locator('#'+field).fill(value)
            page.locator('#help_type').select_option('sourcing')
            page.locator('#data_sensitivity').select_option(label='Public / non-sensitive')
            page.get_by_role('button',name='Agent / AI team',exact=True).click()
            page.get_by_role('button',name='Company',exact=True).click()
            check('mode change preserves company draft',page.locator('#issue').input_value()=='Synthetic local draft only')
            page.get_by_role('button',name='Prepare email request',exact=True).click()
            mail=page.get_by_role('link',name='Open prepared email',exact=True)
            check('draft is honestly prepared',mail.count()==1 and 'Nothing has been sent' in page.locator('.form-status').inner_text())
            page.locator('#issue').fill('Revised synthetic draft')
            check('editing invalidates previous mail',mail.count()==0)
            page.get_by_role('button',name='Prepare email request',exact=True).click()
            check('reprepared mail uses revised text','Revised%20synthetic%20draft' in mail.get_attribute('href'))
            check('email is never sent by the page',page.url.endswith('/start?audience=company'))
            c.close()

            # axe cannot calculate the menu glyph/arrow, or the native textarea
            # placeholder background. Review their computed solid colors too.
            results['contrast_review']=[]
            for path,selector,pseudo,width in [
                ('/','.menu-button > span[aria-hidden]',None,390),
                ('/for-agents','.page-hero p:nth-child(5)',None,1440),
                ('/start?audience=company','#issue','::placeholder',1440),
                ('/start?audience=company','#issue',None,390),
            ]:
                c=context(viewport={'width':width,'height':900});page=c.new_page()
                page.goto(origin+path,wait_until='networkidle')
                element=page.locator(selector);element.scroll_into_view_if_needed()
                colors=element.evaluate(r'''(e,pseudo)=>{
                  const style=getComputedStyle(e,pseudo);let parent=e,background;
                  while(parent){const color=getComputedStyle(parent).backgroundColor;
                    if(color!=='rgba(0, 0, 0, 0)'&&color!=='transparent'){background=color;break;}
                    parent=parent.parentElement;
                  }
                  const luminance=color=>color.match(/[\d.]+/g).slice(0,3).map(Number)
                    .map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4)
                    .reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
                  const a=luminance(style.color),b=luminance(background);
                  return {foreground:style.color,background,opacity:style.opacity,
                    ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
                }''',pseudo)
                check(path+' computed contrast '+selector+str(pseudo),colors['ratio']>=4.5 and float(colors['opacity'])==1,colors)
                results['contrast_review'].append({'route':path,'selector':selector,'pseudo':pseudo,'width':width,**colors})
                c.close()

            # Render the existing, sanitized full-report fixture at every width.
            fixture=json.loads(subprocess.check_output(['node','--import','tsx','-e',
                "const fs=require('node:fs');const {customerReport}=require('./lib/checkout-contract.ts');process.stdout.write(JSON.stringify(customerReport(JSON.parse(fs.readFileSync('test/fixtures/csc-v2-full.json','utf8')))))"],text=True))
            for width,height in WIDTHS:
                c=context(viewport={'width':width,'height':height})
                c.add_init_script("sessionStorage.setItem('seekapi.checkout.order.v1','internal-qa-order')")
                c.route('**/checkout/stripe/customer-status',lambda r:r.fulfill(json={'state':'READY','test_mode':True}))
                c.route('**/checkout/stripe/result',lambda r:r.fulfill(json={'report':fixture}))
                page=c.new_page();page.goto(origin+'/checkout/result',wait_until='networkidle')
                check(f'private report@{width} result visible',page.get_by_role('region',name='Your China Supply Check result').count()==1)
                check(f'private report@{width} overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
                check(f'private report@{width} no sales shell',page.locator('.site-header').count()==0)
                check(f'private report@{width} noindex','noindex' in page.locator('meta[name=robots]').get_attribute('content'))
                page.add_script_tag(path=str(axe))
                audit=page.evaluate("async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));}")
                check(f'private report@{width} axe',not audit,audit)
                page.screenshot(path=str(out/f'private-synthetic-result-{width}.png'))
                c.close()

            # Existing private status: all responses are local synthetic fixtures.
            for state in ['READY','PROCESSING','UNKNOWN','NO_ACCESS','ACCESS_EXPIRED']:
                c=context(viewport={'width':390,'height':844})
                c.add_init_script("sessionStorage.setItem('seekapi.checkout.order.v1','internal-qa-order')")
                c.route('**/checkout/stripe/customer-status',lambda r:r.fulfill(status=403 if state=='NO_ACCESS' else 200,json={'state':state,'test_mode':True}))
                page=c.new_page();page.goto(origin+'/checkout/return',wait_until='networkidle')
                check(state+' no new payment action',page.locator('a[href*="checkout.stripe.com"],button:has-text("Pay now")').count()==0)
                check(state+' private result no analytics',page.locator('.site-header').count()==0)
                if state=='READY': check('READY opens same result',page.get_by_role('link',name='View your supply check').get_attribute('href')=='/checkout/result')
                if state=='UNKNOWN': check('UNKNOWN says do not repay','Do not pay again' in page.inner_text('body'))
                c.close()

            # With privacy controls off, existing-result links still stay out of
            # the sales funnel. The normal new-sale CTA keeps its original lineage.
            c=browser.new_context(viewport={'width':390,'height':844})
            events=[]
            def measurement_route(r):
                if r.request.url=='https://api.seekapi.ai/checkout/stripe/metrics':
                    events.append(r.request.post_data_json)
                    r.fulfill(status=202,json={'accepted':True})
                elif r.request.url.startswith(origin+'/'): r.continue_()
                else: r.abort()
            c.route('**/*',measurement_route)
            page=c.new_page();page.goto(origin+'/support',wait_until='networkidle')
            photo=page.get_by_role('link',name='Open photo-check recovery controls',exact=True)
            photo.evaluate("e=>e.addEventListener('click',event=>event.preventDefault())")
            photo.click();page.wait_for_timeout(100)
            check('recovery keeps original destination',photo.get_attribute('href')=='https://api.seekapi.ai/checkout/stripe/image')
            check('recovery is not a sale',not any(e.get('event_type')=='SALES_CTA_CLICK' for e in events),[e.get('event_type') for e in events])
            page.goto(origin,wait_until='networkidle')
            sale=page.locator('.main-actions a').first
            sale.evaluate("e=>e.addEventListener('click',event=>event.preventDefault())")
            sale.click();page.wait_for_timeout(100)
            check('new-sale attribution remains',any(e.get('event_type')=='SALES_CTA_CLICK' for e in events) and '#sf=' in sale.get_attribute('href'))
            c.close()

            results['slow_lab']=[]
            for path in ['/', '/start?audience=company']:
                c=context(viewport={'width':390,'height':844});page=c.new_page()
                page.add_init_script(SCRIPTS)
                cdp=c.new_cdp_session(page)
                cdp.send('Network.enable')
                cdp.send('Network.emulateNetworkConditions',{'offline':False,'latency':150,'downloadThroughput':125000,'uploadThroughput':125000})
                cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
                page.goto(origin+path,wait_until='networkidle');page.wait_for_timeout(250)
                metrics=page.evaluate('({cls:qaMetrics.shifts.reduce((a,b)=>a+b,0),lcp:qaMetrics.lcp})')
                check(path+' slow lab CLS',metrics['cls']<=0.1,metrics)
                results['slow_lab'].append({'route':path,'network':'1Mbps/150ms','cpu':'4x slowdown',**metrics})
                c.close()

            c=context(reduced_motion='reduce');page=c.new_page()
            page.goto(origin,wait_until='networkidle')
            check('reduced motion removes smooth scrolling',page.evaluate("getComputedStyle(document.documentElement).scrollBehavior==='auto'"))
            check('reduced motion removes button transition',page.locator('.main-actions .button').first.evaluate("(e)=>getComputedStyle(e).transitionDuration==='0s'"))
            c.close()
            browser.close()

    except Exception as exc:
        results['errors'].append({'name':'HARNESS_EXCEPTION','detail':str(exc)[:2000]})

    check('no external request attempted',not results['external_requests'],results['external_requests'])
    results['finished_at']=datetime.datetime.now(datetime.timezone.utc).isoformat()
    results['pass']=not results['errors']
    results['screenshots']={f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in out.glob('*.png')}
    (out/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'pass':results['pass'],'checks':len(results['checks']),'errors':results['errors']},ensure_ascii=False),flush=True)
    return 0 if results['pass'] else 1

if __name__=='__main__': sys.exit(main())
