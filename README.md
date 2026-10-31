# Tine Ugrin — Actor

A minimal English/Slovenian portfolio: a portrait homepage and separate About, Gallery, Video and Contact pages. A supporting Credits page presents selected screen, theatre and upcoming work. The original 2026 acting CV is downloadable from About and Credits in both languages.

## Source

- `src/index.html`: page content and component slots.
- `components/site-header.html` and `page-footer.html`: shared navigation and footer.
- `components/*-dialog.html`: video, portrait and photo attribution viewers.
- `components/credits-rail.html`: compact screen, theatre and upcoming credits tables.
- `components/screen-section.html`: two official trailer thumbnails.
- `copy.json` and component copy: English and Slovenian text.
- `dist/assets/reference-style.css` and `site.js`: the active layout and interactions.
- `scripts/build.py`: generates 12 static pages, metadata, language links and sitemap.

The primary menu follows the reference order: About, Gallery, Video, Contact. Credits is a secondary link. Each route is a real page with its own title, canonical URL and language alternatives. Language switching keeps the current page.

## Build

```sh
python3 scripts/build.py
python3 scripts/check-site.py
node --check dist/assets/site.js
```

Python 3 and Node.js are sufficient; no dependency installation is required. Serve `dist/` for local review. `qa-*.html` files are excluded from version control and must be removed before packaging a manual deploy.

Portraits open in a keyboard-accessible viewer with original JPEG downloads. Trailer links open a player only after a click; closing removes the iframe. Each viewer is included only on its relevant page. With JavaScript unavailable, navigation remains visible and trailer links lead directly to the original video. Credits support browser printing and PDF downloads.

Typography uses local Space Grotesk with named size tokens in `reference-style.css`: 12 px attribution, 14 px small controls, 16 px links, 21 px desktop body and 28 px navigation/headings. Phones use 18 px body and 24 px headings. Mobile credits retain table semantics while displaying each project above its role/format.

## Content

The two videos are official trailers for Gepack and Don't Forget to Breathe. Photographs retain their author credits in the viewer and Photo credits panel. Professional enquiries use the email supplied in Tine's CV; Filmmakers remains accessible in the supporting navigation.

`dist/assets/tine-ugrin-cv-2026-en.pdf` is the owner's original three-page English CV, preserved byte for byte. Both site languages link to this file; the Slovenian label explicitly says EN. About and Credits use its casting information and selected projects. Upcoming work is presented separately. See `CV_CONTENT_SOURCE.md` for provenance and content choices.

The earlier selected-credit PDFs and `scripts/generate-credits-pdf.py` remain legacy authoring assets and are no longer linked by the website. Do not use that generator to overwrite the original CV.

## Deployment

Production: https://tine-ugrin.netlify.app/

Netlify deploys `main` from `juresavron/tineugrin`, runs `netlify.toml` and publishes `dist/`. Local Netlify state is ignored. The earlier private review identity in `.openai/hosting.json` is not the public production destination.

See `VISUAL_AUDIT.md` for the visual comparison, `TEXT_STYLE_AUDIT.md` for the wording/type/component audit and `QA.md` for verification.
