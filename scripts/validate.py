from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

root = Path(__file__).resolve().parents[1]
site = root / "website"
expected = {"index.html", "admission/index.html", "request-info/index.html", "serve/index.html", "about/index.html"}
assert {str(p.relative_to(site)) for p in site.rglob("*.html")} == expected
config = (root / "netlify.toml").read_text()
assert 'publish = "website"' in config
assert "[[redirects]]" not in config, "Keep direct Netlify hosting; no forwarding proxy"

class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
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

for page in site.rglob("*.html"):
    parser = Links()
    parser.page = page
    parser.feed(page.read_text())
print("Validated five pages, local links/assets, and direct Netlify publishing.")
