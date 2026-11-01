# Tine Ugrin — Actor

An English/Slovenian actor portfolio built around Tine’s supplied November 2026 layout reference.

The homepage follows this sequence: portrait hero, short introduction on paper, split About/casting panel on warm brown, selected work on white, three portraits, a featured video with two smaller trailers, warm Contact/form section and a compact footer. Header links move between the homepage sections. The existing About, Credits, Gallery, Video and Contact URLs remain available as real pages.

## Source and build

- `src/index.html`: shared document shell and metadata.
- `components/hero.html`, `intro.html`, `about.html`, `credits-rail.html`, `gallery.html`, `screen-section.html`, `contact.html`: reusable page sections.
- `components/site-header.html`, `page-footer.html` and `*-dialog.html`: shared navigation, footer and viewers.
- `copy.json` and component copy files: English/Slovenian visible text and accessibility labels.
- `dist/assets/reference-style.css` and `site.js`: responsive layout and interactions.
- `scripts/build.py`: creates 14 static pages, language links, metadata and sitemap. The two form confirmation pages are excluded from indexing.

```sh
python3 scripts/build.py
python3 scripts/check-site.py
node --check dist/assets/site.js
```

Python and Node.js are sufficient. No dependency installation is required. Serve `dist/` for review; temporary `qa-*.html` files must be removed before deployment.

## Content and media

The original owner-supplied three-page English CV is unchanged at `dist/assets/tine-ugrin-cv-2026-en.pdf`. Both site languages use this download, with EN identified on the Slovenian buttons. Casting details and selected projects use that CV. See `CV_CONTENT_SOURCE.md`.

Photography retains author attribution and original portrait downloads. The media section uses the verified official trailers for Gepack, Don’t Forget to Breathe and Nika. Video iframes load only after a click and are removed on close. The public Nika trailer is linked by its distributor and is published by Nora Production Group. All media provenance is recorded in `dist/assets/asset-credits.json`.

The earlier selected-credit PDF generator remains a legacy authoring utility. It must not overwrite the original CV.

## Contact form

`portfolio-contact` is a static Netlify Form shared by the English/Slovenian homepage and Contact pages. Fields are name, email, message and language, plus a honeypot. Native validation works without JavaScript; the enhanced handler prevents double-clicks, checks the server response and shows an error without erasing the message. Success routes are `/thank-you/` and `/sl/thank-you/`.

Form detection is enabled for the production project. A new-submission email notification is configured in Netlify for `tine.ugrin@gmail.com` with subject “Tine Ugrin — new website enquiry”. No test enquiry was sent during implementation.

## Deployment

Production: https://tine-ugrin.netlify.app/

Netlify builds `main` from `juresavron/tineugrin` using `netlify.toml` and publishes `dist/`. The older private Sites identity in `.openai/hosting.json` is used only for internal local preview, not production hosting.

See `REFERENCE_LAYOUT.md` for the current layout and `QA.md` for checks. Earlier audit documents describe earlier releases.
