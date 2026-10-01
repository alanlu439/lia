# Accessibility and browser review

Reviewed 1 October 2026. Scope: Home, Admission, Request Info, Serve, and About.

## Results

The corrected pages passed the selected automated WCAG A/AA checks in axe-core 4.10.3, with no reported violations in desktop Chrome/Chromium and WebKit. This is an automated review, not an accessibility certification.

All five pages were checked at 320, 390, 768, and 1440 CSS pixels. No horizontal overflow or missing images remained in the corrected local build. The source link and asset validator also passed.

## Corrections

- Darkened small numbered value labels for readable contrast on warm-white and blue-grey backgrounds.
- Removed inquiry-page overflow at 320 pixels.
- Gave Safari's contact-method selector a consistent height of at least 50 pixels.
- Kept mobile form text at 16 pixels to avoid automatic input zoom on iOS.
- Prevented keyboard focus from entering content covered by the opening screen; entering the site moves focus to the main content.
- Corrected the landing scroll distance so the header becomes usable on short phone screens.
- Adjusted the opening logo and slogan for landscape screens.
- Made navigation and the native inquiry-form destination usable without JavaScript.

## Functional checks

- Opening animation and transition to the header.
- Mobile menu opening and dismissal with Escape.
- Native accordion keyboard operation and animated collapse.
- Reduced-motion layouts and visible content.
- Required parent/email validation and conditional phone requirement.
- GitHub Pages form POST destination and encoded form fields, intercepted during the test so no email was sent.
- No-JavaScript navigation on Home and Admission.

## Coverage and limits

| Platform | Coverage |
| --- | --- |
| Chrome | Installed browser plus Chromium desktop/mobile layout checks |
| Safari | WebKit browser engine, including iPhone touch emulation; physical Safari was not tested |
| Android | Pixel 7 and Galaxy S9+ touch emulation in Chrome |
| iPhone | iPhone SE and iPhone 13 portrait, plus iPhone landscape touch emulation |
| iPad | iPad portrait touch emulation in Chrome |
| Edge | Shared Chromium engine covered; Microsoft Edge application not installed or directly tested |
| Firefox | Test browser could not start reliably in the macOS environment; runtime compatibility remains unverified |

Emulated devices do not establish compatibility with every physical phone, operating-system release, or browser version. Image-overlay readability was visually reviewed; automated contrast checks cannot fully judge every photograph background. VoiceOver/TalkBack/NVDA reading order, system text enlargement, real-device browser chrome, and school-inbox email delivery still need manual verification. Email delivery was not retested in this review.
