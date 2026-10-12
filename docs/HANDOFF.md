# Fuel Food Truck site: handoff (updated 2026-10-12)

The CRAV-style one-page site for FUEL Food Truck. Threads: "Burger joint website", then "Fuel Food Truck site" (current).

## Where things are
- Repo: `labsuncut/site-fuel-food-truck-amman` (branch `claude/project-thread-dax7jw`). Mirror in `/mnt/project-files/sites/site-fuel-food-truck-amman/`.
- Reference audit: `docs/REFERENCE_AUDIT.md`. v2 is based on the live CRAV site, recorded with Playwright.
- Intake facts: labsuncut/ops#3.

## Rules from the user
- **Every food drawing or image must match FUEL's real burgers.** Nothing generic. Ask for their photos.
- **Never spend Higgsfield credits without the user's explicit OK.**

## Stack
- GSAP 3.13 with ScrollTrigger, SplitText and MotionPathPlugin, plus Lenis, all vendored in `assets/js/vendor/`.
- `content.js` holds the words (EN/AR) and hours; `site.js` holds the motion. Timings copied from CRAV are commented "CRAV".

## Waiting on
1. FUEL photos (Double Classic and other burgers, fries, shakes, truck), their logo and their menu names. Then fill the `.ph` spots and draw FUEL's burger for the loader and footer juggling.
2. GitHub Pages: Settings → Pages → Deploy from a branch → `claude/project-thread-dax7jw`, `/ (root)`. Or merge to `main` first.

## Testing tip
Serve with `python3 -m http.server 8080 --bind 0.0.0.0`. Load it in Playwright by the container IP, with `proxy: { server: HTTPS_PROXY, bypass: '<container IP>' }`.
