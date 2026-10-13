# site-fuel-food-truck-amman

Concept website for **FUEL**, a burger container kiosk in Amman. Dark racing look (black, red, chrome) after FUEL's 2026 rebrand, with one Fiesta section that bursts into colour for the Mexican menu. The motion follows [cravburgers.shop](https://www.cravburgers.shop/) with our own code and words.

- **Preview:** https://labsuncut.github.io/site-fuel-food-truck-amman/ (once GitHub Pages is on)
- **Intake and facts:** https://github.com/labsuncut/ops/issues/3
- **Handoff notes:** [docs/HANDOFF.md](docs/HANDOFF.md) · **Motion audit:** [docs/REFERENCE_AUDIT.md](docs/REFERENCE_AUDIT.md)

## What's in here

| File | What it is |
| --- | --- |
| `business.json` | Every fact about FUEL |
| `index.html` | The one-page site (FUEL's logo is inlined at the top as an SVG symbol) |
| `assets/js/content.js` | All the words in English and Arabic, the opening hours and the full price menu |
| `assets/js/site.js` | All the motion (GSAP, ScrollTrigger, SplitText, MotionPath, Lenis) |
| `assets/js/vendor/` | Those animation libraries, saved here so the site needs no outside scripts |
| `assets/css/site.css` | All the styling. Colours are at the top |
| `assets/img/fuel-logo.svg` | FUEL's logo, traced from their brand pack |
| `assets/img/food/`, `container-night.webp` | Photos cut from FUEL's Instagram. Placeholders until FUEL sends originals |

## Still open

- Original photos (we use Instagram crops for now).
- Fiesta prices.
- The exact map pin and the Race Mode sign-up link.
- Font: the logo uses Pace Extra Bold Slanted, a paid font. The site uses Saira Black Italic, a free look-alike.
