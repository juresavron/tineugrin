# Tine Ugrin — Actor portfolio

An English/Slovenian actor portfolio with a full-screen portrait homepage and five separate pages: About, Credits, Video, Gallery and Contact. The visual style uses Space Grotesk, white type, a fixed vertical desktop menu and plain charcoal backgrounds on content pages.

## Structure

- `src/index.html`: shared source template and page content.
- `components/`: credits filmstrip, video section and casting file, with bilingual copy.
- `copy.json`: shared page and viewer copy.
- `scripts/build.py`: creates all 12 HTML pages, page metadata, language links and sitemap.
- `scripts/localize.py`: shared translation helpers.
- `dist/`: deployable pages, bundled fonts, photographs and downloads.

English routes are `/`, `/about/`, `/credits/`, `/video/`, `/gallery/` and `/contact/`. Each has an equivalent under `/sl/`. Navigation performs normal page loads. Each page contains only its own content; the homepage has no scrolling sections. Language switching preserves the current page and selected credit.

## Build and check

Requires Python 3 and Node.js. No package installation is needed.

```sh
python3 scripts/build.py
python3 scripts/check-site.py
node --check dist/assets/site.js
node --check dist/assets/credits-rail.js
node --check dist/assets/screen-section.js
node --check dist/assets/casting-file.js
```

Serve `dist/` with a static web server. Each route is a real directory with an `index.html`, so direct navigation and refresh work without an SPA fallback. The build check validates all pages, local links, page headings, active navigation, canonical URLs and language metadata.

The credits filmstrip supports keyboard, touch and visible arrows. Film details open without autoplay; playback requires an explicit action. Closing the viewer removes the player. Old homepage links such as `?role=breathe#work` forward to `/credits/?role=breathe` without starting video. Casting resources remain available from every page. Printing from another page opens the credits page before printing.

## Content and attribution

Portraits and film stills retain their photographer credits and `dist/assets/asset-credits.json`. Video contains two official film trailers, correctly labelled. The gallery contains professional portraits and a verified Instagram link. Casting enquiries use Tine's professional Filmmakers profile. Personal contact details and representation have not been invented.

The two PDF downloads contain verified selected screen credits, not an unverified full CV. Their optional regeneration script, `scripts/generate-credits-pdf.py`, requires ReportLab; PDF generation is not part of the dependency-free Netlify build.

## Deployment

Production: https://tine-ugrin.netlify.app/

Netlify builds the `main` branch using `netlify.toml` and publishes `dist/`. No dependencies or environment variables are required. Local Netlify state is ignored by Git. The earlier private review identity remains in `.openai/hosting.json`; only `dist/` is published on Netlify.
