# LIA Website

Production repository for the Logos International Academy website at **https://lia.ac.th**.

## Architecture

The current public website is maintained in ChatGPT Sites:

- Source site: `https://logos-international-academy.alanlu439.chatgpt.site`
- Production domain: `https://lia.ac.th`
- Hosting: Netlify
- Repository: `alanlu439/lia`

Netlify uses the catch-all proxy in `netlify.toml` to serve the current ChatGPT Site through the production domain. This keeps the published design synchronized with the ChatGPT Site without manually copying generated site files.

## Netlify configuration

- Production branch: `main`
- Build command: none
- Publish directory: `public`
- Forms: enabled in Netlify
- Custom domain: `lia.ac.th`

Do not remove or change the catch-all proxy in `netlify.toml` unless the site is being migrated to native source code in this repository.

## Website source updates

Always save website source updates to this GitHub repository. The `website/` folder contains the latest five-page static design, including the centered header logo, Georgia typography, and subtle animations.

The owner has explicitly chosen to **keep the current ChatGPT Sites forwarding**. The `website/` folder is a source snapshot and is not the Netlify publish directory. Pushing source changes here does not update the forwarded live design; that still requires a successful ChatGPT Sites publication. Do not remove or replace the catch-all proxy without explicit approval.

Preview the snapshot with `python3 -m http.server 4173 --directory website`.

The snapshot intentionally uses Lorem ipsum and marked school-information/photo placeholders. Its inquiry form is preview-only and does not send or store submissions.

## Repository structure

```text
.
├── .github/workflows/validate.yml   # CI checks for the deployment contract
├── .editorconfig                    # Consistent text formatting
├── .gitignore                       # Local/tooling exclusions
├── netlify.toml                     # Netlify publish, proxy, and headers config
├── public/index.html                # Fallback/static publish entry
├── website/                        # Latest static website source snapshot
└── README.md
```

## Validation

GitHub Actions runs on pushes and pull requests targeting `main`. It checks that:

- `netlify.toml` exists
- `public/index.html` exists
- Netlify still publishes `public`
- The ChatGPT Site proxy target is unchanged
- The fallback page keeps the expected school title

## Editing workflow

1. Make visual/content changes in the ChatGPT Site.
2. Publish the ChatGPT Site changes.
3. `lia.ac.th` should serve the updated result through the Netlify proxy.
4. Commit and push every website source update to `website/` in this repository. Keep hosting configuration unchanged unless specifically requested.

## Future native migration

If the website is later rebuilt as native HTML/CSS/JavaScript or another framework in this repository:

1. Add the full website source here.
2. Update the Netlify build and publish settings.
3. Remove the catch-all proxy redirect from `netlify.toml`.
4. Validate the native deployment before switching production traffic.

## Access and safety

This repository is private. Do not commit passwords, API tokens, Netlify credentials, or other secrets. Use provider-managed environment variables for any future secret configuration.
