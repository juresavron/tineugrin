# Reference layout — 1 November 2026

Implemented from the owner’s supplied full-page layout image, using verified CV content and existing photography.

| Reference area | Implementation |
| --- | --- |
| Dark opening portrait | Large centred portrait, name and actor line at lower left, compact navigation at upper right. |
| Light introduction strip | Film still beside a short introduction. |
| Brown split About section | Biography and compact casting details on the left; full-height portrait on the right. The document icon downloads the original CV. |
| White My work section | Centred selected film/TV, theatre and upcoming credit tables, with a large document download below. |
| Dark Gallery section | Three portrait tiles with a keyboard-accessible viewer and matching original JPEG downloads. |
| Video composition | One wide featured trailer and two smaller official film trailers. |
| Brown Contact section | Direct casting email, labelled name/email/message fields, required validation and spam honeypot. |
| Dark footer | Name, section navigation, professional profiles, language links and photo attribution. |

The palette uses charcoal, warm brown, paper and white, with one local Space Grotesk family. The brown grain is a small local SVG texture. Text remains concise; the CV carries the full career detail.

The homepage now provides the complete stacked composition from the new reference. Existing standalone page URLs remain available, with the same component styling. On smaller screens, the About columns stack, the credits become readable two-line rows, and a section menu replaces the desktop links. Navigation also remains available when JavaScript is disabled.

The current video panels contain Gepack (2024), Don’t Forget to Breathe (2019) and Nika (2016). A personal showreel or presentation clips can be substituted in the same composition when supplied. The reference’s placeholder text and empty video panels were replaced with actual content.

## Verification

Static checks cover all 14 generated pages: headings, section order, translated routes, canonical/language URLs, form fields and local assets. Desktop review covered the hero, intro, About/casting, media and contact compositions. All routes were checked at English 320 px and Slovenian 390 px with no horizontal overflow. Menu opening/closing, same-page navigation, portrait download mapping, video cleanup, no-script navigation and empty-form validation were verified.

The contact form’s capture service and notification recipient are configured in Netlify. Publication verification must confirm that `portfolio-contact` is detected by the deployed site. A real enquiry was not sent as part of testing.

## Revised two-page reference — 1 November, 20:19

The new composition keeps the one-page flow. Space Grotesk SemiBold and centered main headings unify the sections. CV links are outlined buttons with a diagonal arrow. The Instagram strip becomes a wide black-and-white photographic Follow My Journey section; the contact introduction and send button are centered to match the reference. The fixed right rail remains on desktop and becomes a fixed top menu on mobile.

Five selected credits remain visible by default; a full list reveals all 32 CV entries. Each project opens production/director details. Languages retain every proficiency level and additional skills open in a native disclosure. The gallery reveals four additional portraits for seven total, including two supplied Drive originals. Final biography and project descriptions await owner text.
