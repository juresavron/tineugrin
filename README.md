# Tine Ugrin — Actor

A minimal English/Slovenian portfolio: a portrait homepage and separate About, Gallery, Video and Contact pages. Screen credits remain available as a supporting page and two PDF downloads.

## Source

- `src/index.html`: shared header, page content and lightweight viewers.
- `components/credits-rail.html`: the compact credits table.
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

Portraits open in a keyboard-accessible viewer with original JPEG downloads. Trailer links open a player only after a click; closing removes the iframe. With JavaScript unavailable, the trailer links lead directly to the original video. Credits support browser printing and PDF downloads.

## Content

The two videos are official trailers for Gepack and Don't Forget to Breathe. Photographs retain their author credits in the viewer and Image credits panel. Professional enquiries lead to Tine's verified Filmmakers profile. The PDFs contain selected screen credits.

## Deployment

Production: https://tine-ugrin.netlify.app/

Netlify deploys `main` from `juresavron/tineugrin`, runs `netlify.toml` and publishes `dist/`. Local Netlify state is ignored. The earlier private review identity in `.openai/hosting.json` is not the public production destination.

See `VISUAL_AUDIT.md` for the visual comparison and `QA.md` for verification.
