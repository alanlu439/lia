# LIA Website

Production bridge for the Logos International Academy website.

## Source

The current public website is maintained in ChatGPT Sites:

- https://logos-international-academy.alanlu439.chatgpt.site

## Netlify

This repository is configured for Netlify using `netlify.toml`.

The Netlify site proxies all routes to the current ChatGPT Site so edits published there are reflected automatically through Netlify without copying site files manually.

### Netlify settings

- Build command: none
- Publish directory: `public`
- Production branch: `main`

## Future migration

When the site source becomes exportable or is rebuilt directly in this repository, remove the catch-all proxy redirect from `netlify.toml` and deploy the native site from GitHub instead.
