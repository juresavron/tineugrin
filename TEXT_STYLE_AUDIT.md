# Text, typography and component audit

31 October 2026. Reviewed six routes in English and Slovenian against Jurij Drevenšek's portfolio. The goal is concise factual copy, a clear type hierarchy and one purpose per page.

## 1. Wording

| Area | Finding | Applied change |
| --- | --- | --- |
| About | Already brief, with a few unnecessary words; the Slovenian second sentence was indirect. | One factual two-sentence bio. Names three representative screen projects. |
| Languages | A list was styled as a sentence. | Removed the final full stop; preserved the four verified languages without adding proficiency claims. |
| Download | “Screen credits / PDF” describes the file rather than the action. | “Download credits (PDF)” / “Prenesi vloge (PDF)”. |
| Professional profile | “Full profile / Filmmakers” repeats the provider. | “Casting profile” / “Igralski profil”. |
| Credits actions | Long print and database labels compete with project names. | “Print” and “Full filmography”; equivalent concise Slovenian labels. |
| Attribution | English labels remained in Slovenian HTML; the panel listed an unused film still and repeated profile links. | Fully translated labels; attribution covers the photographs currently shown. |
| Portrait viewer | The heading repeats the actor's name. | “Portraits” / “Portreti”; author and download stay visible. |
| Search/social descriptions | Some descriptions still used earlier promotional wording. | Short descriptions that explain each page's actual content. |

The homepage remains a portrait and navigation. Gallery and Video keep images, titles and dates. Contact keeps a single enquiry route. No extra explanatory paragraphs were added.

## 2. Typography

Jurij's desktop brand and navigation measured 28 px with a 42 px line height; body copy measured 21 px with a 27 px line height. Tine now uses the same Space Grotesk family and a closely matched hierarchy.

| Role | Before | After |
| --- | --- | --- |
| Desktop brand / navigation | 27 / 28 px, medium | 28 px, semibold, aligned at the top |
| Desktop body | 22 px / 34.1 px line height | 21 px / 27.3 px line height |
| Phone body | 19 px | 18 px / 27 px line height |
| Page headings | 23–26 px | 28 px desktop; 24 px phone |
| Resource links | 13–15 px | 16 px |
| Language links | 10 px desktop | 14 px; at least 32 × 44 px targets |
| Footer copyright / photographer | 8–10 px | 12 px |
| Footer photo credits button | 10 px | 14 px; 44 px minimum height |
| Phone credits | 12 px in three narrow columns | 16 px project; 14 px role/format and year in stacked rows |
| Viewer attribution / download | 10–12 px | 14 px |

The small-screen brand is 16–21 px according to available width. Icon symbols use their own dimensions. Shared CSS tokens define the text sizes; print styles use point sizes appropriate to paper.

## 3. Components and behavior

The shared header, footer and three viewers are separate templates. Every page still has one main section and one primary heading.

| Page | Included viewers |
| --- | --- |
| Home | None |
| About, Contact, Credits | Photo credits |
| Gallery | Portrait viewer, Photo credits |
| Video | Video player, Photo credits |

The JavaScript tolerates absent page components. Closing a video removes its iframe. Portrait navigation updates the image, descriptive alternative text, author and original download together. Close returns focus to the opener. Navigation remains available on phones when JavaScript is unavailable.

The active translation source was reduced from 182 to 68 keys per language. The browser translation payload is 1,281 bytes instead of 14,582 bytes. Labels and alternative text use the same translation system as visible content, including the initial server-rendered HTML.

## 4. Downloads

Both one-page A4 credits PDFs now use embedded Space Grotesk Regular, Medium and Semibold, monochrome links and a white background. Redundant introductory/footer wording and the blue accent were removed. The portrait, seven selected credits and three professional links remain. Both languages were rendered and visually inspected; text stays within the page and all three link annotations are present.

## 5. Sources and verification

- [Jurij Drevenšek — About](https://www.jurij-drevensek.com/about/): typography and layout reference, inspected in a desktop browser.
- [Tine Ugrin — Filmmakers](https://www.filmmakers.eu/en/actors/tine-ugrin): actor bio, languages, principal screen titles and the role Tibor Fortuna.
- [Tine Ugrin — Slovenian Film Database](https://bsf.si/sl/ime/tine-ugrin/): supporting filmography. Gepack uses the 2024 release year shown on the professional actor profile; BSF catalogues its production as 2023.

Static validation covers all 12 routes, headings, language alternatives, active links and local assets. Browser checks cover the desktop About layout, all 12 narrow layouts, menus, portrait/download mapping, localized photo credits, video open/close cleanup and navigation without JavaScript. No horizontal overflow was observed at 320 px English and 390 px Slovenian viewport widths.
