# Tine Ugrin — The Character Study

An English/Slovenian portfolio for actor Tine Ugrin. The experience moves from the person to his characters, through a screening room, and back to a photographic contact sheet. A compact Casting file brings professional resources together.

## Structure

- `src/index.html`: editable page layout.
- `components/`: character study, portrait contact sheet and casting file, with their bilingual copy.
- `copy.json`: shared page and film-viewer copy.
- `dist/`: deployable static site, bundled fonts, portraits and film stills.
- `scripts/`: dependency-free build and source checks.

## Build and check

Requires Python 3 and Node.js. No package installation is needed.

```sh
python3 scripts/build.py
python3 scripts/check-site.py
node --check dist/assets/site.js
node --check dist/assets/character-study.js
node --check dist/assets/portrait-contact-sheet.js
node --check dist/assets/casting-file.js
```

Serve `dist/` with any static web server. Both `/` and `/sl/` are generated. A role can be linked with `?role=gepack#work`, `?role=breathe#work` or `?role=legend#work`. Links select a character silently; video requires a deliberate viewing action.

## Content and attribution

Portraits and film stills retain photographer credits in the interface and `dist/assets/asset-credits.json`. The two official film trailers are correctly labelled; neither is presented as a personal acting reel. Casting enquiries use Tine’s existing professional Filmmakers profile. Height, playing age, personal email and representation have not been invented.

## Netlify deployment

Production: https://tine-ugrin.netlify.app/

Netlify builds the `main` branch with the command in `netlify.toml` and publishes `dist/`. The build regenerates both language pages and checks local asset references before publishing. No dependencies or environment variables are required. Local Netlify state in `.netlify/` is ignored by Git.

The earlier private Sites review identity is retained in `.openai/hosting.json`. Only `dist/` is published on Netlify.
