# Website review — 3 October 2026

Scope: all five public pages at https://alanlu439.github.io/lia/, plus local verification of the corrections. Current browser evidence was collected in the in-app browser. Desktop viewport: 1280 × 720; phone layouts: 390 × 844 and 320 × 568. This is a practical review, not an accessibility certification.

## Page-by-page findings

1. **Home — working.** The loading overlay clears; the centered opening leads into the photographed hero. The menu becomes usable after entering. Program cards respond to Enter. The extra opening/loading stage increases the time before visitors can reach admissions or contact information.
2. **Admission — working, draft text corrected.** Navigation and FAQ keyboard interaction work. Two FAQ answers contained “School to provide.” Removed those words while preserving directions to contact the office; no fees or enrollment details were invented. The LCA destination returned HTTP 200. Useful next addition: school-approved enrollment dates, document requirements and fees.
3. **Serve — working, content could be stronger.** The page explains the purpose of service and links to inquiries. Its descriptions remain general; verified recent service examples and photos showing those activities would make it more convincing.
4. **About — working, heading hierarchy corrected.** The first section heading skipped from H1 to H3. Changed it to H2 while preserving its appearance. Mission, vision, story and priorities retain their existing content and shared spacing.
5. **Request Info — validation working; delivery not retested.** Empty submission stays on the page and focuses the parent-name field. Phone becomes required when the preferred contact method is Phone; added a visible required marker to match that behavior. Inputs remain 16px with heights above 50px at 320px. The Netlify receiving page returned HTTP 200. No inquiry was sent, so school-inbox delivery remains unverified.

## Shared corrections and checks

- Removed the new menu clip-path from the no-JavaScript fallback in all five pages. Otherwise its links could be visually clipped despite the fallback making them visible. Verified a script-free local fixture at 320px: visible navigation, clip-path none, and no horizontal overflow.
- Full-width mobile dropdown remains intact; 390px panel width matches the viewport. Opening, Escape dismissal and menu navigation were checked. Same-origin page navigation completed successfully; a frame-by-frame transition audit was not performed.
- No horizontal overflow in the five pages at 320px. No missing alt attributes. No broken local HTML links, fragments, duplicate IDs, or CSS asset paths in the source checks. Each page has one H1. JavaScript syntax and build checks pass. No page console errors were observed during the sampled interactions.

## Recommended next improvements

1. **Make first entry faster.** Home forces every inline image to eager loading before dismissing the loader. Prioritize the opening/hero and leave lower-page photographs lazy-loaded. Convert the 727KB Montserrat TTF to WOFF2 and measure the resulting transfer/load improvement. Preserve the requested loader appearance.
2. **Improve small-phone footer readability.** The unbroken slogan computes to 9.928px at 320px, versus 12.483px at 390px. Keeping the exact sentence on one line requires very small text; either permit wrapping on narrow screens or approve a shorter phone version.
3. **Explain form data handling.** Add a school-approved privacy notice covering the inquiry data, who receives it, retention and a contact for questions. The current note only says contact details will be used to reply. Avoid requesting sensitive student information in the message field.
4. **Add sharing and search metadata.** All pages have titles and descriptions, but no Open Graph metadata; no sitemap or robots file was found. Add canonical URLs, sharing titles/descriptions and an approved school photograph for previews.
5. **Consolidate the stylesheet.** Repeated overrides for spacing, menus and transitions make future changes prone to regressions. Consolidate component rules while keeping their final computed appearance, then repeat responsive checks.
6. **Complete real-device and delivery verification.** Check Safari, Firefox and Edge directly, screen-reader navigation, enlarged text and reduced-motion mode, and receipt of a test inquiry in the school inbox.

## Evidence and limits

Screenshots are from this review, not earlier audits. Accepted desktop captures cover the opening, Admission hero, Serve hero, About hero and inquiry fields. Phone captures cover the menu, About hero, Home opening/hero and corrected script-free navigation. Blank or loading captures were rejected as final evidence. Layout checks do not establish physical-device compatibility. No current axe scan, screen-reader audit, network-throttled performance measurement, or actual email delivery test was performed. The registration and partnership statements are existing school-provided content, not independently authenticated in this review.
