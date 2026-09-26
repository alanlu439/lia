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

## Repository structure

```text
.
├── .github/workflows/validate.yml   # CI checks for the deployment contract
├── .editorconfig                    # Consistent text formatting
├── .gitignore                       # Local/tooling exclusions
├── netlify.toml                     # Netlify publish, proxy, and headers config
├── public/index.html                # Fallback/static publish entry
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
4. Only edit this repository when changing hosting, deployment, proxy, headers, or repository configuration.

## Future native migration

If the website is later rebuilt as native HTML/CSS/JavaScript or another framework in this repository:

1. Add the full website source here.
2. Update the Netlify build and publish settings.
3. Remove the catch-all proxy redirect from `netlify.toml`.
4. Validate the native deployment before switching production traffic.

## Access and safety

This repository is private. Do not commit passwords, API tokens, Netlify credentials, or other secrets. Use provider-managed environment variables for any future secret configuration.
