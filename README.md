# Logos International Academy website

The website source of truth is the private `alanlu439/lia` GitHub repository. Netlify serves the five-page static website directly from `website/`.

## Publishing

1. Edit files in `website/`.
2. Run `python3 scripts/validate.py` and `node --check website/assets/site.js`.
3. Commit and push to `main`.
4. Confirm the connected Netlify project, `logos-international-academy`, successfully publishes the matching commit.

Production: https://logos-international-academy.netlify.app

Netlify uses `netlify.toml`, publishes `website/`, and needs no build command. The old ChatGPT Sites proxy has been removed with the owner's approval. Domain and access settings remain managed in Netlify. The old `public/` fallback is retained but is not published.

## Local preview

Run `python3 -m http.server 4174 --directory website` and open http://localhost:4174/.

## Design and content

Georgia headings and Arial body text; navy, warm white, and a muted blue accent. The header uses the navy logo, and all footers use the supplied transparent white logo. Image frames use a 3:2 ratio. Motion respects reduced-motion preferences.

Editorial body text is intentionally Lorem ipsum. Official contact details and photography remain marked placeholders. The inquiry form is preview-only and does not send or store submissions. Connect an approved admissions destination before treating it as a working inquiry form.

Never commit secrets or credentials. Keep the repository private.
