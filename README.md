<p align="center">
  <img src="website/assets/lia-logo.png" width="110" alt="LIA school seal">
</p>

<h1 align="center">LIA Language School</h1>
<p align="center">Website source and publishing tools · Chiang Mai, Thailand</p>
<p align="center">
  <a href="https://alanlu439.github.io/lia/">GitHub Pages</a> ·
  <a href="https://logos-international-academy.alanlu439.chatgpt.site/">ChatGPT Site</a> ·
  <a href="docs/maintenance.md">Maintenance guide</a>
</p>

## About this repository

This repository maintains the five-page LIA Language School website: **Home, Admission, Inquire, Serve, and About**. It contains the school-supplied branding, approved content, photography, and the tools used to publish the site.

The website uses plain HTML, CSS, and JavaScript. No application framework or dependency installation is required.

## Website features

- Responsive navigation: desktop links and a centered popup on narrow screens, with the whole page and header blurred behind it. Tap outside or press Escape to dismiss the popup.
- A first-visit loading screen with progress, followed by a fade into the website.
- White fades between pages and fade-in breadcrumbs on inner pages.
- A seamless, repeating service banner that moves continuously and responds to scrolling.
- Georgia headings, Montserrat body text, and favicons that follow the visitor’s light or dark theme.
- An inquiry form, school contact links, and a Lighthouse Christian Academy partnership section.
- Reduced-motion support and keyboard navigation.

The inquiry page is now [`/inquire/`](https://alanlu439.github.io/lia/inquire/). The previous `/request-info/` address redirects there.

## Project structure

```text
website/                 Editable website source
  assets/                Shared styles, scripts, logos, and photographs
  admission/             Admission page
  inquire/               Inquiry form and school contact information
  request-info/          Redirect for the previous inquiry address
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
git diff --check
```

GitHub Actions validates changes and publishes `main` to GitHub Pages. The generated `_site/` folder is not committed.

## Publishing

Pushing to `main` runs the validation and **Publish GitHub Pages** workflows. GitHub Pages serves the generated `_site/` output under `/lia/`.

Website changes must also be published to the existing [ChatGPT Site](https://logos-international-academy.alanlu439.chatgpt.site/). Its separate source checkout is maintained outside this repository. Sync `website/` into that checkout’s `dist/`, adjust canonical, social, sitemap, and robots URLs to the ChatGPT Site origin, then publish through Sites. Preserve the existing audience and confirm the deployment succeeds. GitHub Actions does not perform this second publication automatically.

The existing Netlify host supplies inquiry collection. Verify it separately when changing form delivery; publishing to GitHub Pages or Sites does not deploy Netlify.

## Maintaining the website

- [Maintenance and publishing](docs/maintenance.md)
- [Content, branding, and photography](docs/content-guide.md)
- [Contributing and reporting issues](CONTRIBUTING.md)

The Inquire form uses **Netlify Forms** for inquiry collection and email notifications. GitHub Pages serves the website; it does not process or email submissions itself. See the maintenance guide for the current form behavior and hosting limitations.

School facts must be verified before publication. Do not add unsupported fees, dates, policies, accreditation claims, or staff information. Supplied branding and photography are not offered under an open-source license.
