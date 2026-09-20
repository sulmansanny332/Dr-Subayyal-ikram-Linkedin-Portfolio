# Dr. Subayyal Ikram — Multilingual Portfolio

Open `index.html` in a browser. No installation or build step is required. Keep the CSS, JavaScript and assets folders alongside it. `Dr_Subayyal_Ikram_LinkedIn_Portfolio.html` opens the same website.

## Separate sections

The homepage now gives a short introduction to each section with a **For detailed info, click here** link. Full content is on separate pages:

- `about.html`: personal introduction and values.
- `journey.html`: education and career timeline.
- `projects.html`: all 13 projects and location filters.
- `offices.html`: four office locations and addresses.
- `faith.html`: faith and resilience.
- `profile.html`: full biography, references, copying and translated downloads.
- `contact.html`: contact details and all five official platform links.

Each detail page provides a home link and links to the other sections. New visits default to English; navigation carries the selected Urdu or Arabic language through the `lang` URL parameter. The shared scripts support pages that contain only their own section.

## Current website

- English by default, with Urdu and Arabic switching and right-to-left layouts.
- Translated headings, biography, captions, controls, accessible labels, copied About text and downloadable profile text.
- Supplied logo with transparent background and animated header/footer presentation. Urdu and Arabic versions retain its emblem with translated wordmarks.
- Ambient lighting, scroll reveals, animated captions, interactive cards and subtle image movement throughout the page. No pause/resume button. Device-level reduced-motion preferences remain respected.
- 13 company project cards using original-resolution ABS Developers imagery, plus Lahore, Islamabad, Sialkot and Karachi office addresses. Office cards explicitly identify their pictures as regional project images.
- The five user-supplied official website/Facebook/Instagram/TikTok/LinkedIn links, with SVG icons, in the contact section and footer.

## Profile photo and additional images

The supplied portrait is installed only in the homepage hero at `Assets/dr-subayyal-original-enhanced.png`. The portrait is mirrored through CSS and displayed without cropping, with space around the hair. The current portrait is an AI-enhanced version of the originally supplied images.jpeg; the source is retained. Additional event photos can be added later. Four to six original, high-resolution photographs are suitable: a clear portrait, a formal/business image, a Quran-recitation image, a speaking/event image and up to two optional photographs.

Save them in `Assets/` and set their paths in `Assets/images.js`. Portrait and project image slots are supported. Existing project imagery remains visible if an override is empty or cannot load.

## Removed areas

The dedicated recitation section/page has been removed at the user’s request. There are no blog sections or blog navigation links. Biographical references to faith and Quran recitation remain part of the personal story. All seven homepage cards now have images.

## Files and sources

- `styles.css`: responsive styles, RTL rules and animation.
- `script.js`: navigation, filters, image overrides, copying and print controls.
- `translations.js` / `i18n.js`: translations and language switching.
- `Assets/image-sources.json`: source URLs and dimensions for 13 original project images (1680 pixels wide).
- `Assets/recitation-sources.json`: original recitation thumbnail sources.
- `Assets/social-links.json`: the five exact URLs supplied by the user.
- `Assets/IMAGE_EDIT_NOTES.md`: built-in imagegen logo prompts and editing notes.
- `Assets/`: Bootstrap Icons SVG assets with the included MIT license.

Newly written biographical prose preserves factual names, qualifications and dates. Source notes distinguish company claims and reported personal history. Source project photographs/renders were kept at their available original resolution, without AI rebuilding of architectural details.

## Publish

Upload the HTML, CSS, JavaScript, Markdown and `Assets/` files to a static website host. This website has not been deployed and the live LinkedIn profile has not been changed.
