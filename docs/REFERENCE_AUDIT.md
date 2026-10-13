# CRAV reference audit (v2, 2026-10-12)

Reference: https://www.cravburgers.shop/ (Awwwards Site of the Day, 13 June 2026).

## How it was checked

v1 relied on text sources only, because the build machine could not open the site. For v2, the new cloud environment loaded the live site in Chromium (Playwright). We recorded it while scrolling at 1280×800 and 390×844, and read the animation settings (durations, easings, scroll-trigger points) from its public JavaScript bundles.
We copy behaviour and timing only. FUEL's code, words and art are our own.

## What CRAV actually does

| Part | What we saw |
| --- | --- |
| Fonts | **Both.** Mouse Memoirs for headlines and body text; Modak for rotated stickers and the giant footer logo |
| Colours | Cream `#f5e3cd`, red `#f91814`, mustard section yellow, mustard-dark sticker text, maroon `#4c0016`, orange `#ef6f2e` |
| Loader | Red screen. A cartoon burger stacks itself: each layer drops from y −800 (0.32 s, power1.in) every 0.22 s, settles its tilt (0.45 s, back.out(2.5)), and the stack squashes on each landing. The status line changes per layer ("Searing the glazed patty…"). A yellow progress bar fills in 1.5 s at the bottom. Then sparks burst, the burger hops (bounce.out) and flies up. Three curtains (red, orange, maroon) lift 0.12 s apart: the corners rise in 0.8 s (power2.inOut) and the middle in 1.1 s (power4.inOut), so the bottom edge curves |
| Header | Logo left; red "Burgers" pill and white "Menu ☰" pill right |
| Hero | Giant red "THE BURGER" with a white outline. Two rotated Modak stickers ("Smashed fresh" at +15°, "Bold flavor" at −15°). A burger photo pops in (scale 0.5, y +100, −5°, to normal in 1.5 s, back.out(1.5), 0.5 s delay), then floats ±15 px (2.5 s, sine.inOut). Yellow "CRAV" logo under it; two short paragraphs bottom-left and bottom-right |
| Statement | "Top classic" sticker, two-line headline, paragraph, red blob "Order now", three photo cards tilted 5°, −5° and 8° that react to mouse speed with inertia; a mascot sticker |
| Waves | Section edges are wavy SVG paths that wobble (sine.inOut, 1–2 s) and stretch (scaleY to 1.5, scrubbed, top 80% to bottom 20%; 1.2 on phones) |
| Experience | Red section, cream headline, burger with cartoon eyes and gloves, stat lines left and right |
| Full-bleed | Close-up photo of a burger in hands, with wavy edges |
| Every layer | Cream; ingredient cut-outs (lettuce, tomato, cheese, patty) fly around the headline as you scroll |
| Take away | Yellow; a plane rides a dashed path (MotionPath, auto-rotate, scrubbed) past city photo cards; vertical on phones |
| Feel it | Cream; headline, paragraph, Order now, photo with a mascot sticker |
| Footer | Links and © line, a rule that draws itself (scaleX 0.9 s power3.out at top 92%), then a giant Modak "CRAV" with ingredients tossed up and falling behind and in front of it in a loop |
| Stickers | Pop in once at "top 95%" |

## FUEL build v3 (rebrand, 2026-10-13): what we kept from CRAV

FUEL's look is now its own (black, red, chrome). We kept CRAV's motion timings:

| FUEL effect | CRAV source |
| --- | --- |
| Loader curtains (3 curved curtains, 0.12 s apart, 0.8 s corners, 1.1 s middle) | **Verified** timing. Start lights replace CRAV's burger stack |
| Hero photo pop-in (scale 0.5 → 1, 1.5 s back.out(1.5)) and ±15 px float | **Verified** |
| Tilted cards that lean with mouse speed | Layout **verified**, inertia **approximated** |
| Section edges stretch on scroll (scaleY 1.5, top 80% → top 20%; 1.2 on phones) | **Verified** settings; edges are slanted instead of wavy |
| Drink grows on scroll (CRAV's experience burger) | **Approximated** |
| Race Mode bolt on a track | Same idea as CRAV's plane on a dashed path; straight track instead of a motion path |
| Footer rule (scaleX 0.9 s power3.out at top 92%) and juggling loop | **Verified**; FUEL bolts instead of ingredients |
| Speed streaks, Fiesta colour burst, confetti, papel picado | **FUEL-only** |

## Not done on purpose

- No invented food drawings. Every food picture is FUEL's own (from their Instagram).
- No cookie banner (we use no cookies or trackers).
