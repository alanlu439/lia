from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from xml.etree import ElementTree
import re

root = Path(__file__).resolve().parents[1]
site = root / "website"
expected = {"index.html", "admission/index.html", "request-info/index.html", "serve/index.html", "about/index.html"}
assert {str(p.relative_to(site)) for p in site.rglob("*.html")} == expected
config = (root / "netlify.toml").read_text()
assert 'publish = "website"' in config
assert "[[redirects]]" not in config, "Keep direct Netlify hosting; no forwarding proxy"

class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "link" and attributes.get("rel") == "canonical":
            self.canonical.append(attributes.get("href"))
        if tag == "meta":
            self.metadata[attributes.get("property", attributes.get("name"))] = attributes.get("content")
        for key, value in attrs:
            if key not in ("href", "src") or not value:
                continue
            url = urlsplit(value)
            if url.scheme or url.netloc or not url.path:
                continue
            path = unquote(url.path)
            target = site / path.lstrip("/") if path.startswith("/") else self.page.parent / path
            if target.is_dir():
                target /= "index.html"
            assert target.is_file(), f"Broken target in {self.page}: {value}"

canonical_urls = set()
for page in site.rglob("*.html"):
    parser = Links()
    parser.page = page
    parser.canonical = []
    parser.metadata = {}
    parser.feed(page.read_text())
    route = page.parent.relative_to(site).as_posix()
    canonical = "https://alanlu439.github.io/lia/" + ("" if route == "." else route + "/")
    assert parser.canonical == [canonical], f"Incorrect canonical URL in {page}"
    assert parser.metadata.get("og:url") == canonical
    assert parser.metadata.get("og:title") and parser.metadata.get("og:description")
    assert parser.metadata.get("twitter:card") == "summary_large_image"
    image = urlsplit(parser.metadata.get("og:image", ""))
    assert image.netloc == "alanlu439.github.io" and image.path.startswith("/lia/assets/")
    assert (site / image.path.removeprefix("/lia/")).is_file(), f"Missing sharing image in {page}"
    canonical_urls.add(canonical)

namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
locations = [element.text for element in ElementTree.parse(site / "sitemap.xml").findall("s:url/s:loc", namespace)]
assert len(locations) == 5 and set(locations) == canonical_urls, "Sitemap must match the five canonical pages"
for url in re.findall(r"url\(['\"]?([^)'\"]+)", (site / "assets/style.css").read_text()):
    if url.startswith("data:"):
        continue
    target = site / url.lstrip("/") if url.startswith("/") else site / "assets" / url
    assert target.is_file(), f"Missing CSS asset: {url}"
print("Validated five pages, local/CSS assets, canonical URLs, sharing metadata, sitemap, and direct Netlify publishing.")
