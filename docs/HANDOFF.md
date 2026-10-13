# Fuel site: handoff (updated 2026-10-13)

v3 is the rebrand: a dark racing site (black, red #ED1C24, chrome) with a colourful Fiesta section. Thread: "Fuel Food Truck site".

## Where things are
- Repo: `labsuncut/site-fuel-food-truck-amman` (branch `claude/project-thread-dax7jw`). Mirror in `/mnt/project-files/sites/site-fuel-food-truck-amman/`.
- Brand files: `/mnt/project-files/sites/fuel-brand/` (logo, container photo, Instagram stills incl. `menu.jpg` with prices).
- Intake facts: labsuncut/ops#3.

## Decisions from the team (2026-10-13)
- Look: dark racing site, one Fiesta section in colour. Racing motion: start-lights loader, red streaks, bolt on the Race Mode track.
- Font: closest to the logo is Pace Extra Bold Slanted (paid). We use Saira Black Italic (free). Space Mono for small print, Cairo for Arabic.
- Top sellers: Double Classic, Animal Fries, Mango Coco (signature drink), plus Double Truffle.
- Prices on the menu story (21 Aug 2026) are current.
- Hours: Sun–Thu 11 AM–1 AM, Fri–Sat 11 AM–2 AM (weekend days assumed).
- No original photos available, so we cut them from FUEL's Instagram and marked each one PLACEHOLDER.
- "Join Race Mode" button goes to vuedale.com until we have FUEL's exact sign-up link.

## Rules from the team
- **Every food image must be FUEL's real food.** No generic or invented food art.
- **Never spend Higgsfield credits without the team's explicit OK.**

## Sections
Loader (5 start lights) → Hero (container at night, chrome headline, Double Classic, red logo) → Top sellers (4 cards) → Passion tank (red, Mango Coco, hours) → Eat. Drive. Repeat! (full-bleed) → ¡Fiesta! (colour burst, papel picado, 4 items) → Menu (all prices) → Race Mode (loyalty track) → Visit (container photo, hours, map) → Footer (logo, juggling bolts).

## Testing tip
Serve with `python3 -m http.server 8080 --bind 0.0.0.0`. Load it in Playwright by the container IP, with `proxy: { server: HTTPS_PROXY, bypass: '<container IP>' }`. Google Maps is blocked from the build machine, so the map shows grey in screenshots only.
