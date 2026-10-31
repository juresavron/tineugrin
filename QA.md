# Separate-page portfolio verification

## Build checks

- Six actual page routes in English and Slovenian; 12 generated HTML files and 206 matching translation keys.
- Every page has one main content section and one primary heading.
- Navigation uses separate page URLs. The current page is marked in desktop and mobile navigation before JavaScript runs.
- Local pages, images, downloads, anchors and font assets resolve. Each route has its own title, description, canonical URL and language alternatives. The sitemap lists all 12 routes.
- All active JavaScript files pass Node syntax checks.

## Browser checks

- The homepage contains only the portrait opening and has no scrolling content sections.
- About, Credits, Video, Gallery and Contact were opened and visually inspected as separate desktop pages.
- Content pages use plain charcoal backgrounds. The busy film still has been removed from page backgrounds.
- All 12 pages were checked in responsive frames: English at 320 px and Slovenian at 390 px. Content width equals available viewport width on every page.
- Tablet and desktop widths were inspected during the style pass.
- Mobile navigation loads the requested subpage; EN/SL switching stays on the equivalent page.
- Portrait navigation updates the matching original JPEG download.
- Casting resources open from a content page, and View selected credits navigates to the Credits page.
- Film details open without starting video. Explicit Play creates the selected Vimeo player; closing removes it.
- Legacy homepage credit links forward to the new Credits route and preserve the role query.
- Print routing was reviewed in source: requests from other pages navigate to Credits; native print hooks expose the full credits table and restore it afterwards.

## Content limits

Personal showreel, approved full CV, direct contact and unverified profile URLs have not been invented. Videos remain labelled as official trailers; the PDF downloads are selected screen credits. Temporary responsive-review HTML is excluded from release output.
