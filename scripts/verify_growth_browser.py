#!/usr/bin/env python3
"""Verify actual first-screen candidate content; never substitutes for owner acceptance."""
import argparse
import json
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("base_url")
parser.add_argument("--browser", default="agent-browser")
parser.add_argument("--executable-path")
parser.add_argument("--session", default="website-growth-evidence")
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
output = root / "docs/website-growth"
(output / "screenshots").mkdir(exist_ok=True)
started = False
def run(*commands):
    global started
    prefix = [args.browser, "--session", args.session]
    if args.executable_path and not started:
        prefix += ["--executable-path", args.executable_path]
    started = True
    return subprocess.check_output(prefix + list(commands), text=True).strip()

expression = """JSON.stringify({
 width:innerWidth,height:innerHeight,
 overflow:document.documentElement.scrollWidth>innerWidth,
 h1:document.querySelector('h1').innerText,h1Count:document.querySelectorAll('h1').length,
 briefBottom:document.querySelector('.growth-brief').getBoundingClientRect().bottom,
 resultBottom:document.querySelector('.growth-result').getBoundingClientRect().bottom,
 briefFields:Array.from(document.querySelectorAll('.growth-inputs>div')).map(row=>({
  label:row.querySelector('dt').innerText,bottom:row.getBoundingClientRect().bottom})),
 resultText:document.querySelector('.growth-result').innerText,
 outcome:(()=>{const e=document.querySelector('.growth-outcome');if(!e)return null;const r=e.getBoundingClientRect();return {text:e.innerText,visible:r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden',top:r.top,bottom:r.bottom}})(),
 paidNoteBottom:document.querySelector('.growth-availability').getBoundingClientRect().bottom,
 limitsBottom:document.querySelector('.growth-limits').getBoundingClientRect().bottom,
 errorOverlay:!!document.querySelector('[data-nextjs-dialog]')
})"""
records = []
try:
    for variant in ["a", "b", "c"]:
        viewports = [("mobile", 375, 812), ("desktop", 1440, 900)]
        if variant != "a": viewports += [("mobile-tall", 375, 900)]
        for label, width, height in viewports:
            run("set", "viewport", str(width), str(height))
            run("open", args.base_url.rstrip("/") + "/website-growth-preview/" + variant)
            run("wait", "--load", "networkidle")
            data = json.loads(run("eval", expression))
            if isinstance(data, str): data = json.loads(data)
            assert not data["overflow"] and data["h1Count"] == 1 and not data["errorOverlay"], data
            assert data["paidNoteBottom"] <= height and data["limitsBottom"] <= height, data
            if variant in ["b", "c"]:
                assert data["resultBottom"] <= height and data["briefBottom"] <= height, data
                assert all(field["bottom"] <= height for field in data["briefFields"]), data
            if variant == "b":
                assert [field["label"] for field in data["briefFields"]] == ["Product / model", "Quantity + unit", "Must-have specification"], data
                assert "Three distinct shop candidates" in data["resultText"] and "shortage" in data["resultText"], data
            if variant == "c":
                assert data["outcome"]["visible"] and 0 <= data["outcome"]["top"] < data["outcome"]["bottom"] <= height, data
                assert "three distinct shop candidates" in data["outcome"]["text"] and "shortage" in data["outcome"]["text"], data
                for term in ["TECHNICAL_BLOCKED", "29 Sep 2026", "CNY 0.01 per 个", "MOQ 100 个", "UNKNOWN", "Price-tier applicability at 500 pieces", "exact pack conversion", "not a confirmed price for 500 pieces"]:
                    assert term.lower() in data["resultText"].lower(), (term, data)
            data.update(variant=variant, viewport=label, page_errors=run("errors"))
            assert not data["page_errors"], data
            if label != "mobile-tall":
                run("screenshot", str(output / "screenshots" / (variant + "-" + label + ".png")))
            records.append(data)
finally:
    run("close")
(output / "browser-verification.json").write_text(json.dumps({
    "records": records,
    "mobile_menu_navigation": "Separately verified: keyboard menu activation and Source from China destination",
    "skip_link": "Separately verified: Tab focuses skip link, Enter reaches #main-content",
    "buyer_study": "CANCELED_BY_OWNER; governance decision 5909261935",
    "review_repair": "5364732399: B/C content visible in first screen; C price-tier and pack uncertainty adjacent; stopped re-review C success/shortage regression repaired",
    "owner_acceptance": "PENDING; browser geometry is not owner candidate acceptance",
}, indent=2) + "\n")
print(json.dumps({"candidate_viewport_checks": len(records), "errors": [], "owner_acceptance": "PENDING"}))
