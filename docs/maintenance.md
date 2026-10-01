# Maintenance and publishing

## Source of truth

Edit `website/` in this repository. Keep all five pages and their shared assets together. Do not edit generated `_site/` output or introduce a second copy of the website here.

## Publishing

1. Preview the change and run the validation commands in the README.
2. Commit and push to `main`.
3. Verify the **Publish GitHub Pages** workflow succeeds for that commit.
4. Sync the same `website/` files into the existing ChatGPT Sites checkout's `dist/` directory and publish using its registered Sites workflow. Preserve its public audience.
5. Confirm both successful deployments before reporting a full publish.

| Destination | Purpose |
| --- | --- |
| [GitHub Pages](https://alanlu439.github.io/lia/) | Primary website; automatically published from `main` |
| [ChatGPT Sites](https://logos-international-academy.alanlu439.chatgpt.site/) | Synchronized website; separate publication required |
| [Netlify](https://logos-international-academy.netlify.app/) | Existing website and active inquiry handler |

Netlify production deployments were paused by account credit limits when checked on **1 October 2026**. The existing inquiry handler was tested successfully on that date. Recheck the account before attempting another Netlify production deployment. Do not claim a paused host has received the latest design.

`vercel.json` is retained for the optional Vercel project. A configuration file alone does not establish that its production deployment is current.

## GitHub Pages packaging

The project lives under `/lia/`. `scripts/build-pages.py` copies the source into `_site/` and updates root-relative HTML and stylesheet asset paths for that prefix. Keep source links root-relative so the same source works on the other hosts.

## Inquiry delivery

The form is registered as `lia-inquiry` in Netlify. Notifications are configured for **logos.chiangmai@gmail.com**.

- GitHub Pages submits by normal POST to Netlify and displays its confirmation page.
- ChatGPT Sites submits through an AJAX request to the existing Netlify endpoint.
- The Vercel configuration forwards `/api/inquiry` to that endpoint.
- Local preview shows a message instead of sending an inquiry.

Keep the registered form field names, hidden `form-name`, and honeypot consistent with the HTML. Preserve the approved school email notification. Never publish credentials or put email-service secrets in browser JavaScript.

For delivery checks, use an explicitly authorized, clearly labeled test without student information. A successful submission record verifies collection; it does not independently verify arrival in the recipient's inbox.

## Hosting settings

Preserve existing domain names, public access, and repository name unless the owner requests a change. Renaming `lia` would change the GitHub Pages project path. Netlify uses direct hosting; do not restore the former Sites forwarding proxy.
