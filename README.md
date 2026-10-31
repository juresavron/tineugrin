# Tine Ugrin — Actor portfolio

An English/Slovenian portfolio for actor Tine Ugrin. The page follows the supplied sketch: portrait hero, About, visual credits, video, gallery and contact. Full-screen photography, white Space Grotesk typography and fixed side navigation follow the visual direction of the supplied [Jurij Drevenšek reference](https://www.jurij-drevensek.com/contact/). Tine’s own photographs, credits and professional links supply the content. A persistent Casting file brings professional resources together.

## Structure

- `src/index.html`: editable page layout.
- `components/`: credits rail, screen section and casting file, with their bilingual copy.
- `copy.json`: shared page and film-viewer copy.
- `dist/`: deployable static site, bundled fonts, portraits and film stills.
- `dist/assets/reference-style.css`: photographic theme and responsive side/mobile navigation.
- `scripts/`: dependency-free build and source checks.

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

Serve `dist/` with any static web server. Both `/` and `/sl/` are generated. The credit strip supports keyboard, touch and visible arrows. A role can be linked with `?role=gepack#work`, `?role=breathe#work` or `?role=legend#work`. Legacy #work links select the corresponding project silently; video requires a deliberate viewing action.

## Content and attribution

Portraits and film stills retain photographer credits in the interface and `dist/assets/asset-credits.json`. The two official film trailers are correctly labelled; neither is presented as a personal acting reel. The Gallery contains professional portraits and an Instagram link verified through Tine’s Filmmakers profile. Casting enquiries use Tine’s existing professional Filmmakers profile. Height, playing age, personal email and representation have not been invented. Downloadable EN/SL PDFs contain verified selected screen credits. Gospod profesor’s Tibor Fortuna role is sourced from the official Filmmakers profile. Bundled font licenses are included under `dist/assets/fonts/`.

## Netlify deployment

Production: https://tine-ugrin.netlify.app/

Netlify builds the `main` branch with the command in `netlify.toml` and publishes `dist/`. The build regenerates both language pages and checks local asset references before publishing. No dependencies or environment variables are required. Local Netlify state in `.netlify/` is ignored by Git.

The earlier private Sites review identity is retained in `.openai/hosting.json`. Only `dist/` is published on Netlify.

## Credit PDFs

The two prebuilt PDFs in `dist/assets/` are published as static downloads. The optional `scripts/generate-credits-pdf.py` regenerates them locally using ReportLab and the bundled fonts; it is not part of the dependency-free Netlify build.
