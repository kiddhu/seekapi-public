#!/usr/bin/env python3
"""Outside-in no-value checks against an implementation preview; never calls MCP."""
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = self.direction = self.canonical = self.robots = ""
        self.h1 = 0
        self.links, self.alternates, self.ids, self.schemas = [], {}, set(), []
        self.title, self.text = "", ""
        self.in_title = False
        self.script = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang, self.direction = a.get("lang", ""), a.get("dir", "")
        if tag == "h1": self.h1 += 1
        if tag == "title": self.in_title = True
        if a.get("id"): self.ids.add(a["id"])
        if tag == "a": self.links.append(a.get("href", ""))
        if tag == "link" and a.get("rel") == "canonical": self.canonical = a.get("href", "")
        if tag == "link" and a.get("rel") == "alternate" and a.get("hreflang"):
            self.alternates[a["hreflang"]] = a.get("href", "")
        if tag == "meta" and a.get("name") == "robots": self.robots += ";" + a.get("content", "")
        if tag == "script": self.script = {"type": a.get("type"), "data": ""}

    def handle_data(self, data):
        if self.script is not None:
            self.script["data"] += data
        else:
            self.text += data + " "
        if self.in_title: self.title += data

    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
        if tag == "script" and self.script is not None:
            if self.script["type"] == "application/ld+json":
                self.schemas.append(json.loads(self.script["data"]))
            self.script = None

def path(url):
    return urlsplit(url).path.rstrip("/") or "/"

def fetch(base, route):
    try:
        with urlopen(Request(base + route, headers={"User-Agent": "Python-urllib/3.11"}), timeout=20) as response:
            return response.status, response.read().decode()
    except HTTPError as error:
        return error.code, error.read().decode()

def verify(base, production=False):
    root = Path(__file__).resolve().parents[1]
    baseline = json.loads((root / "docs/website-growth/route-baseline.json").read_text())
    errors, records, cache = [], [], {}
    def check(condition, message):
        if not condition: errors.append(message)
    for route in baseline["routes"]:
        status, html = fetch(base, route)
        page = Page()
        page.feed(html)
        cache[route] = page
        first = route.split("/")[1]
        expected = "pt-BR" if first == "pt-br" else first if first in ["ja", "es", "ar", "de", "ru"] else "en"
        check(status == 200, f"{route}: HTTP {status}")
        check(page.lang == expected, f"{route}: initial lang {page.lang}, expected {expected}")
        check(page.direction == ("rtl" if expected == "ar" else "ltr"), f"{route}: dir {page.direction}")
        check(page.h1 == 1, f"{route}: {page.h1} H1s")
        check(path(page.canonical) == route and urlsplit(page.canonical).hostname == "seekapi.ai", f"{route}: canonical {page.canonical}")
        check(page.title.count("| SeekAPI") <= 1, f"{route}: repeated brand suffix")
        check(bool(page.title.strip()), f"{route}: empty title")
        check(("noindex" not in page.robots) if production else ("noindex" in page.robots), f"{route}: wrong robots {page.robots}")
        for schema in page.schemas:
            check('"Offer"' not in json.dumps(schema), f"{route}: live Offer markup")
        records.append({"path": route, "status": status, "lang": page.lang, "dir": page.direction, "h1": page.h1, "title": page.title, "canonical": page.canonical, "robots": page.robots})
    for route, page in cache.items():
        for lang, target in page.alternates.items():
            if lang == "x-default": continue
            other = cache.get(path(target))
            check(other is not None, f"{route}: missing alternate {target}")
            if other:
                check(other.lang == lang, f"{route}: alternate language {lang} differs from {other.lang}")
                check(any(path(back) == route for key, back in other.alternates.items() if key != "x-default"), f"{route}: nonreciprocal alternate {target}")
        for link in page.links:
            if not link or link.startswith(("mailto:", "tel:")): continue
            target = urlsplit(urljoin("https://seekapi.ai" + route, link))
            if target.hostname != "seekapi.ai": continue
            target_path = path(target.geturl())
            if target_path not in cache:
                status, _ = fetch(base, target_path)
                check(status == 200, f"{route}: broken internal link {link} -> {status}")
            elif target.fragment:
                check(target.fragment in cache[target_path].ids, f"{route}: missing link fragment {link}")
    for route in ["/", "/china-supply-check", "/china-supply-check/sample"]:
        check("TECHNICAL_BLOCKED" in cache[route].text, f"{route}: historical status missing")
    check("Paid checks are not yet open." in cache["/"].text, "home: paid-closed note missing")
    check("MCP-capable client" in cache["/"].text, "home: MCP-only preparation unclear")
    for variant in ["a", "b", "c"]:
        route = "/website-growth-preview/" + variant
        status, html = fetch(base, route)
        page = Page(); page.feed(html)
        check(status == (404 if production else 200), f"{route}: wrong preview isolation {status}")
        check("noindex" in page.robots, f"{route}: preview indexable")
    for route in ["/fr", "/ja/not-a-page", "/ru/china-supply-check"]:
        status, _ = fetch(base, route)
        check(status == 404, f"{route}: expected 404, got {status}")
    status, sitemap = fetch(base, "/sitemap.xml")
    check(status == 200 and "website-growth-preview" not in sitemap, "sitemap: candidate routes leaked")
    if production:
        import xml.etree.ElementTree as ET
        urls = [path(node.text) for node in ET.fromstring(sitemap).findall(".//{*}loc")]
        check(set(urls) == set(baseline["routes"]), f"sitemap: mismatch {len(urls)} URLs")
    check("https://api.seekapi.ai/mcp" in cache["/for-agents"].text, "Agent: endpoint missing")
    return {"mode": "production-equivalent" if production else "preview", "base_url": base, "routes_verified": len(records), "locale_routes": sum(r["lang"] != "en" for r in records), "errors": errors, "records": records, "live_acceptance": False, "human_study": "NOT_RUN", "search_benchmark": "NOT_RUN"}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("base_url")
    parser.add_argument("--production", action="store_true")
    parser.add_argument("--output")
    args = parser.parse_args()
    result = verify(args.base_url.rstrip("/"), args.production)
    if args.output: Path(args.output).write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({key: value for key, value in result.items() if key != "records"}, indent=2))
    raise SystemExit(bool(result["errors"]))
