# Sketch-layout release verification

## Build and content

- English and Slovenian pages regenerate from source with 199 matching copy keys.
- HTML structure, unique IDs, anchors, local assets and bundled fonts pass `scripts/check-site.py`.
- All five active JavaScript files pass Node syntax checks; the Git diff passes whitespace checks.
- The page follows hero → About → visual credits → On screen → portraits/Instagram → professional profiles.
- Seven verified screen credits include Tibor Fortuna in Gospod profesor, sourced from the current official Filmmakers profile.
- The Instagram destination is cross-linked from that official profile. The four-image strip is labelled as portraits, with photographer credits.
- Two downloadable PDFs contain selected screen credits in EN/SL. Both were rendered and inspected: one A4 page, correct diacritics, embedded fonts and three professional links.
- Video remains labelled as two official trailers. No personal showreel, full CV, direct email or unverified platform link has been invented.

## Browser verification

- Desktop hero, About, credits filmstrip and screen section visually reviewed.
- Responsive iframe checks: 320 × 568, 390 × 844 (EN and SL), 768 × 1024 and 1440 × 900. Document width matches available viewport width at each size. A narrow footer overflow was fixed.
- Short-phone hero keeps the name, Casting file and video action visible.
- Credits arrows advance the native rail; keyboard activation opens the correct film without starting video and returns focus on close.
- Explicit trailer Play creates the correct Vimeo player. Closing the viewer removes the iframe and stops playback.
- Headshot selection changes the displayed portrait and matching original JPEG download.
- Compact casting dialog fits the short phone, with its close action visible and the correct PDF link.
- Mobile menu closes after section navigation.
- Legacy `?role=breathe#work` selects the corresponding card silently. EN/SL navigation preserves the role and anchor; Slovenian download links target the Slovenian PDF.
- Slovenian hero/portrait alternative text and portrait-viewer accessible name are translated.
- Print handlers open the complete credits list for printing and restore its prior state afterwards; this contract was reviewed in source.

Temporary responsive-review HTML is excluded from release output. Netlify Deploy Preview and production verification are performed against the committed release.
