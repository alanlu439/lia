# Website improvements — 3 October 2026

## Changes

- Serve the same licensed Montserrat variable font as WOFF2: 215,736 bytes instead of 744,936 bytes, a 71% reduction. The original TTF and license remain as source assets. Character mapping was compared after conversion.
- Preload the font on all five pages. Home prioritizes a responsive hero image and decodes only the landing/header logos, hero and font before dismissing the existing loader. Lower-page photographs remain lazy-loaded. Rejected loading tasks no longer reject the completion handler; the existing 12-second escape remains.
- Keep the full footer slogan on larger screens. At widths up to 420 pixels, show “Heart and skill to serve.” on one line at 13.6 pixels instead of shrinking the longer sentence below 10 pixels.
- Add factual inquiry guidance: the Netlify submission destination, optional student details, avoiding sensitive information and an office email for questions. No retention duration, privacy guarantees or unapproved school policy was invented.
- Add page-specific canonical URLs, Open Graph titles/descriptions/URLs, a sharing photograph and a large-image card declaration. Add a five-page XML sitemap and robots file.
- Remove obsolete named-page transitions and repeated floating/closing menu overrides. Preserve the white fade, full-width slide-down dropdown and rounded controls.
- Expand validation to cover canonical/sharing URLs, image paths, sitemap membership and CSS asset references.

## Verification

- Source validation, JavaScript syntax, GitHub Pages build, metadata/sitemap checks and diff checks passed.
- All five pages fit at 320, 885 and 1280 pixels in the in-app browser without horizontal overflow.
- Loader completed; Home retained two lower-page lazy images and a high-priority responsive hero.
- Menu opening, Escape dismissal and menu-to-About navigation passed. The new-page animation remained white-page-in. No console errors were observed in the sampled flow.
- Mobile footer screenshot confirmed the compact slogan; computed size was 13.6 pixels. The inquiry guidance was visually inspected at 320 pixels.
- Font size reduction is an asset measurement, not a measured page-load-time improvement.

## Remaining items

New service examples, admissions facts and a formal retention policy were skipped at the user's request. Physical-device, direct Safari/Firefox/Edge, screen-reader and school-inbox delivery checks were not performed in this change.

GitHub Pages serves this repository under /lia/. Search engines use robots.txt at the host root, so the project-level robots file does not control all of alanlu439.github.io. The sitemap can be submitted separately in the site's search-console account; no submission was made.
