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

## Original CV content update

- Inspected all three supplied CV pages and preserved the download byte for byte (SHA-256 recorded in `CV_CONTENT_SOURCE.md`).
- Checked all four CV download links across English/Slovenian About and Credits; they reference the same original file with an explicit download filename. No JavaScript switches them back to the earlier summaries.
- Verified both Contact pages use the email from the supplied CV.
- Reviewed the three updated page types on desktop and at 320 px English / 390 px Slovenian. No horizontal overflow was observed.
- Screen, theatre and upcoming groups retain readable rows and semantic table headers. Future projects are separated from completed work.

## Supplied reference layout — 1 November 2026

- Confirmed the seven-section homepage order and compact footer match the supplied composition.
- Reviewed desktop hero/intro, warm About/casting split, video arrangement and contact form.
- Checked all 14 routes at English 320 px and Slovenian 390 px; content width equals available width.
- Verified mobile section navigation stays on the homepage and releases its inert/scroll lock.
- Verified Slovenian portrait navigation updates the author and original JPEG together.
- Opened the Nika player: its official Nora Production Group title and 1:44 duration are visible. Closing removes the iframe.
- Verified empty-form submission focuses the required name field without sending a message.
- Verified navigation and native POST form remain available without scripts.
- Enabled Netlify form detection and saved the email notification to Tine’s supplied contact address. No test enquiry was sent.

## WhatsApp follow-up — 1 November 2026

- Read the owner’s design messages and both attachments. Rendered the one-page PDF and extracted its original portrait JPEG without altering its bytes.
- Reviewed the wider gold About panel and actual supplied portrait on desktop. Navigation remains fixed and vertical on the right.
- Checked all 14 routes at 320 px English and 390 px Slovenian with no horizontal overflow. Both hero title rows fit within their viewports.
- Checked the 1024 px layout: credit table ends at 798 px and navigation begins at 860 px, leaving the content clear of the rail.
- Verified role rotation, slash colours and pause/resume behaviour. Reduced-motion handling is present in both the script and CSS.
- Opened all three disclosures: five portraits, twelve credit rows and four videos are visible. Keyboard activation also works without scripts.
- Verified mobile menu closure, background-inert cleanup, five-image viewer navigation, matching original downloads and focus restoration.
- Opened the additional video: the official Nika Zorjan title and artist channel are visible. Closing removes its iframe and releases the body lock.
- Verified contact inputs share their left edge and width; text fields are 48 px tall and the message area is 164 px tall at 320 px.
- Original CV and existing form contract remain unchanged. No WhatsApp reply or test enquiry was sent.

## Revised evening WhatsApp brief — 1 November 2026

- Rendered both pages of the updated PDF, read the 20:20 brief, and inspected the original CV's three-page text and relevant page image.
- Cross-checked all 32 CV entries in seven categories and four upcoming labels. Native full-list disclosure and a selected project's production/director information were opened in the browser.
- Read back all 15 sports and their levels, instruments, dance, singing, licences, education, four workshops and award. Unspecified ratings and ambiguous billing labels were not inferred.
- Reviewed desktop hero, outlined CTAs, About/casting split, centered headings, photographic Instagram banner and contact layout. Main heading computed weights are 600.
- Checked all 14 routes at English 320 px and Slovenian 390 px: no horizontal overflow. Also checked home at 320 px Slovenian and 768/1024 px tablet widths. Expanded English skills, credits and gallery remain within the 320 px viewport.
- Verified the seven-image viewer opens the new monochrome portrait with the matching original JPEG; Escape closes it and releases the body scroll lock.
- Verified mobile menu open, background inert state, same-page Work navigation, menu closure and inert cleanup.
- Verified the empty form focuses the required name field; fields have identical left edge and width. No enquiry was sent.
- Rechecked the source CV SHA-256: unchanged. Build, existing site checks, JavaScript syntax and diff whitespace checks pass.
- Corrected narrow bilingual hero CTAs; rechecked 320/390 px and 768 px layouts. Name/title and buttons retain a 26–38 px vertical gap with no overflow.
