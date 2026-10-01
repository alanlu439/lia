<p align="center">
  <img src="website/assets/lia-logo.png" width="110" alt="LIA school seal">
</p>

<h1 align="center">LIA Language School</h1>
<p align="center">Website source and publishing tools · Chiang Mai, Thailand</p>
<p align="center">
  <a href="https://alanlu439.github.io/lia/">Visit the website</a> ·
  <a href="docs/maintenance.md">Maintenance guide</a>
</p>

## About this repository

This repository maintains the five-page LIA Language School website: **Home, Admission, Request Info, Serve, and About**. It contains the school-supplied branding, approved content, photography, and the tools used to publish the site.

The website uses plain HTML, CSS, and JavaScript. No application framework or dependency installation is required.

## Project structure

```text
website/                 Editable website source
  assets/                Shared styles, scripts, logos, and photographs
  admission/             Admission page
  request-info/          Inquiry form and school contact information
  serve/                 Service and community page
  about/                 School identity and story
  index.html             Home and landing experience
scripts/                 Validation and GitHub Pages packaging
.github/                 Automated checks, publishing, and issue templates
docs/                    Maintenance, content, and deployment guides
netlify.toml             Existing Netlify site and form configuration
```

## Preview locally

```sh
python3 -m http.server 4174 --directory website
```

Open **http://localhost:4174/**. Inquiry delivery is disabled in the local preview.

## Validate changes

```sh
python3 scripts/validate.py
node --check website/assets/site.js
python3 scripts/build-pages.py
```

GitHub Actions validates changes and publishes `main` to GitHub Pages. The generated `_site/` folder is not committed.

## Maintaining the website

- [Maintenance and publishing](docs/maintenance.md)
- [Content, branding, and photography](docs/content-guide.md)
- [Contributing and reporting issues](CONTRIBUTING.md)

The Request Info form uses **Netlify Forms** for inquiry collection and email notifications. GitHub Pages serves the website; it does not process or email submissions itself. See the maintenance guide for the current form behavior and hosting limitations.

School facts must be verified before publication. Do not add unsupported fees, dates, policies, accreditation claims, or staff information. Supplied branding and photography are not offered under an open-source license.
