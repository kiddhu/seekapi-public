#!/usr/bin/env python3
"""Emulated touch navigation only; external requests and all writes are blocked."""
import argparse
import json
import pathlib
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url',default='http://127.0.0.1:3000')
    parser.add_argument('--output',required=True)
    args=parser.parse_args()
    origin=args.base_url.rstrip('/')
    if urlsplit(origin).hostname not in ['127.0.0.1','localhost','::1']:
        parser.error('Use a loopback build.')
    output=pathlib.Path(args.output)
    if output.exists(): parser.error('Choose a new evidence filename.')
    rows=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        for width,height in [(360,800),(375,812),(390,844),(430,932)]:
            context=browser.new_context(viewport={'width':width,'height':height},has_touch=True,is_mobile=True,device_scale_factor=2)
            context.add_init_script("Object.defineProperty(Navigator.prototype,'doNotTrack',{get:()=> '1'});Object.defineProperty(Navigator.prototype,'globalPrivacyControl',{get:()=>true});")
            blocked=[]
            def route(r):
                if r.request.url.startswith(origin+'/') and r.request.method in ['GET','HEAD']: r.continue_()
                else: blocked.append({'method':r.request.method,'host':urlsplit(r.request.url).netloc});r.abort()
            context.route('**/*',route)
            page=context.new_page();page.goto(origin,wait_until='networkidle')
            menu=page.locator('.menu-button')
            menu.tap()
            opened=menu.get_attribute('aria-expanded')=='true'
            menu.tap()
            closed=menu.get_attribute('aria-expanded')=='false'
            page.locator('.main-actions a').nth(1).tap()
            page.wait_for_url('**/china-supply-check')
            screening='supplier candidates' in page.locator('h1').inner_text()
            page.get_by_role('link',name='My results',exact=True).tap()
            page.wait_for_url('**/support#existing-results')
            result=page.locator('#existing-results').is_visible()
            rows.append({'width':width,'menu_open':opened,'menu_close':closed,'screening_navigation':screening,'existing_results_navigation':result,'blocked_requests':blocked})
            context.close()
        browser.close()
    passed=all(all(row[key] for key in ['menu_open','menu_close','screening_navigation','existing_results_navigation']) and not row['blocked_requests'] for row in rows)
    report={'scope':'EMULATED_TOUCH_CHROMIUM_NOT_A_PHYSICAL_DEVICE','pass':passed,'cases':rows}
    output.parent.mkdir(parents=True,exist_ok=True)
    with output.open('x') as file: json.dump(report,file,indent=2)
    print(json.dumps(report))
    return 0 if passed else 1

if __name__=='__main__': raise SystemExit(main())
