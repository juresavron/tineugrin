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

Production verification is recorded after publication.
