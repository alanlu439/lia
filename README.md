# LIA Language School website

The website source of truth is the private `alanlu439/lia` GitHub repository. Netlify serves the five-page static website directly from `website/`.

## Publishing

1. Edit files in `website/`.
2. Run `python3 scripts/validate.py` and `node --check website/assets/site.js`.
3. Commit and push to `main`.
4. Confirm the connected Netlify project, `logos-international-academy`, successfully publishes the matching commit.
5. Sync the same `website/` files into `../lia-site/dist/` and publish the existing ChatGPT Site using the Sites hosting workflow, preserving public access.
6. Verify both deployments. A request to publish always means both hosts, with GitHub updated.

Netlify: https://logos-international-academy.netlify.app

ChatGPT Site: https://logos-international-academy.alanlu439.chatgpt.site

Netlify uses `netlify.toml`, publishes `website/`, and needs no build command. The old ChatGPT Sites proxy has been removed with the owner's approval. Domain and access settings remain managed in Netlify. The old `public/` fallback is retained but is not published.

## Local preview

Run `python3 -m http.server 4174 --directory website` and open http://localhost:4174/.

## Design and content

Georgia headings and Arial body text; navy, warm white, and a muted blue accent. The header uses the navy logo, and all footers use the supplied transparent white logo. Image frames use a 3:2 ratio. Motion respects reduced-motion preferences.

School content and contact details come from the September 30, 2026 school information supplied by the owner. Use LIA Language School in website copy. Retain the original supplied seals and centered header at the owner’s request. No school photographs have been supplied; typographic program panels replace empty photography frames. The inquiry form submits to Netlify Forms without opening an email app. Netlify stores submissions and sends notifications to logos.chiangmai@gmail.com. Keep the form notification configured in the Netlify dashboard. The same public endpoint is used by the ChatGPT Site, with its origin allowed by the request-info response header. Tuition, documents, application dates, and detailed requirements remain unconfirmed.

Never commit secrets or credentials. Keep the repository private.

The homepage uses a scroll-linked navy opening with the original seal and Soli Deo Gloria. Reduced-motion and no-JavaScript visitors get a static opening. Each page has its own layout treatments; retain the shared header and navigation.
