# Minimal portfolio verification

## Static checks

The existing build validation passes for all 12 pages: balanced markup, one primary heading and one content section per page, active navigation, canonical URLs, language alternatives, local links, images, fonts and downloads. The active JavaScript passes Node's syntax check.

## Visual review

- Compared Jurij's five primary pages with Tine's five primary pages and supporting Credits page.
- Inspected the rebuilt Home, About, Gallery, Video, Contact and Credits layouts in a desktop browser.
- Reviewed all 12 routes in responsive frames: English at 320 px and Slovenian at 390 px. Every document's content width equals its available viewport width.
- Inspected the mobile gallery and About/menu views. Portrait tiles preserve faces; the menu separates page navigation from supporting links.

## Interactions

- Mobile menu opens, makes page content inert and navigates to the chosen separate page.
- Portrait navigation updates its author attribution and matching original JPEG. Closing restores focus and releases the body scroll lock.
- A trailer click starts the Vimeo player; its visible playback controls confirm playback. Closing removes the iframe and releases the scroll lock.
- Video links remain direct external links when JavaScript is unavailable.
- Language links preserve the current page; English and Slovenian PDFs point to their corresponding files.
- Legacy homepage section links continue to forward to their corresponding pages.
- Credits retain semantic table markup, print styling and a PDF download.

## Text and component refinement

- Measured the reference's desktop typography and checked the rebuilt About layout: 28 px navigation/brand and 21 px body with 27.3 px line height.
- Reviewed all 12 routes at English 320 px and Slovenian 390 px. Content width equals the available viewport width, including the scrollbar on longer pages.
- Verified the new two-line mobile credit rows, 16 px resource links and readable attribution text.
- Verified dialog inclusion: none on Home; photo credits on inner pages; portrait viewer only on Gallery; video player only on Video.
- Tested the homepage menu with no footer present, menu open/close and background inert state, portrait navigation/download/author updates, focus restoration and body scroll unlock.
- Verified Slovenian static labels, portrait alternatives, photo credits and trailer viewer labels.
- Opened and closed the localized Vimeo trailer; closing removes the iframe. Video playback itself was verified in the preceding visual release.
- Checked the mobile navigation fallback with scripts disabled.
- Rendered both updated credits PDFs. Each is one A4 page with three link annotations and embedded Space Grotesk weights. Text remains within page bounds; no clipping or overlap was observed.
