# Editing this portfolio

Routine content updates do not require React or layout code. This site is a small static site driven by two editable JSON files:

- `content/site.json` — Home, Experience, navigation links, footer, and résumé path
- `content/projects.json` — project cards, project order, project descriptions, and every project page

JSON requires double quotation marks and commas between items. When editing, copy the punctuation pattern already in the file.

## Where each kind of content lives

| Content | Exact location |
| --- | --- |
| Homepage hero and short About Me text | `content/site.json` → `eyebrow`, `headline`, `disciplines`, and `home` |
| Homepage profile photo | `public/images/profile.png` |
| Projects page heading | `content/site.json` → `projectsPage` |
| Project titles and card descriptions | `content/projects.json` → each project's `title` and `summary` |
| Project-page introductions and sections | `content/projects.json` → `lede`, `role`, `tools`, `media`, and `sections` |
| Experience entries | `content/site.json` → `experience` and `education` |
| Experience logos | `public/images/experience/` |
| Project images, galleries, and project videos | `public/media/<project-slug>/` |
| Optional hero image | `public/media/hero/` |
| Résumé PDF | `public/assets/Yashwanth_Muppidi_Resume.pdf` |

The existing project media folders are:

- `public/media/ariel/`
- `public/media/nemo/`
- `public/media/zipline-projects/`
- `public/media/third-thumb/`
- `public/media/vtol/`
- `public/media/harry/`
- `public/media/vex/`

## 1. Change text

Open `content/site.json` for general page text or `content/projects.json` for project text. Change the words between quotation marks and save.

Examples:

- Homepage About Me heading and introduction: `content/site.json` → `home.aboutEyebrow` and `home.aboutTitle`
- Experience entries: `content/site.json` → `experience`
- NEMO description: `content/projects.json` → find `"slug": "nemo"`, then edit `summary`, `lede`, or `sections`

## 2. Replace an existing image

The easiest method is to replace the file in `public/media/<project-slug>/` with a new file that has the same filename. No JSON change is needed.

If the new filename is different, update its `src` value in `content/projects.json` too.

For the homepage profile photo, add or replace `public/images/profile.png`. Keep that filename and the photo updates without any JSON or JavaScript changes. Until the file exists, the homepage shows a neutral text placeholder.

Experience logo slots work the same way. Add the real logo files with these exact paths:

- `public/images/experience/zipline-logo.jpg`
- `public/images/experience/johnson-johnson-medtech-logo.jpg`
- `public/images/experience/dupont-logo.jpg`
- `public/images/experience/purdue-humanoid-robotics-club-logo.jpg`

Keeping those filenames means no content or JavaScript changes are needed. To use a different filename, update that experience entry's `logo.src` in `content/site.json`.

## 3. Add a new image

Card and overview image slots are already configured. Add a real image using one of these exact paths and the site will replace the neutral placeholder automatically:

| Project | Card image | Project-page overview image |
| --- | --- | --- |
| Ariel | `public/media/ariel/ariel-cover.avif` | Work-in-progress page intentionally has no overview image yet |
| NEMO | `public/media/nemo/nemo-current-robot.jpg` | Narrative page uses the curated NEMO images and videos listed below |
| Zipline Projects | `public/media/zipline-projects/zipline-projects-cover.avif` | `public/media/zipline-projects/zipline-projects-overview.avif` |
| Third Thumb | `public/media/third-thumb/third-thumb-cover.avif` | Narrative page uses the supplied `third-thumb-*.png` files in the same folder |
| VTOL Aircraft | `public/media/vtol/vtol-cover.avif` | Narrative page uses the supplied `vtol-*.png` files in the same folder |
| H.A.R.R.Y. | `public/media/harry/harry-cover.avif` | `public/media/harry/harry-overview.avif` |
| VEX Robot | `public/media/vex/vex-cover.avif` | `public/media/vex/vex-overview.avif` |

Several project-section image slots are also ready:

- `public/media/nemo/nemo-mechanical-design.jpg`
- `public/media/nemo/nemo-engineering-analysis.jpg`
- `public/media/nemo/nemo-simulation.jpg`
- `public/media/nemo/nemo-fabrication-testing.jpg`
- `public/media/zipline-projects/zipline-project-01.jpg`
- `public/media/third-thumb/third-thumb-mechanism.jpg`
- `public/media/vtol/vtol-mechanical-development.jpg`
- `public/media/harry/harry-build.jpg`

You do not need to edit JSON when using those exact filenames. The file contents must match their extension: these `.avif` cover and overview files must contain real AVIF image data.

NEMO has a detailed narrative layout. Its text and technical metadata are in `content/projects.json` under `"slug": "nemo"` → `lede`, `summary`, `tools`, and `nemoStory`. Its curated page assets are all in `public/media/nemo/`:

- `nemo-current-robot.jpg`
- `nemo-final-lower-body-cad.png`
- `nemo-early-lower-body-cad.png`
- `nemo-design-progression.png`
- `nemo-structural-fea.png`
- `nemo-manufactured-prototype.png`
- `nemo-upper-body-cad.png`
- `nemo-upper-body-prototype.png`
- `nemo-test-stand.png`
- `nemo-sim-to-real.mp4`
- `nemo-shuffling.mp4`

To replace an asset without changing JSON, replace the file with another image or MP4 using the same filename. To use a different filename, update the matching `src` inside `nemoStory`. Both videos are muted MP4 files configured to loop while visible, play inline on mobile, and retain playback controls. New images or videos can be added to `public/media/nemo/` and referenced from the appropriate `nemoStory` media entry without editing React.

Third Thumb has a concise narrative layout. Its page text is in `content/projects.json` under `"slug": "third-thumb"` → `lede`, `summary`, and `narrative`. Its current page images are:

- `public/media/third-thumb/third-thumb-bench-setup.png`
- `public/media/third-thumb/third-thumb-assembled-prototype.png`
- `public/media/third-thumb/third-thumb-cad.png`
- `public/media/third-thumb/third-thumb-worn-prototype.png`

To replace, reorder, or add to this story later, edit the matching `heroMedia`, `intro.media`, `mechanism.media`, or `integration.media` entry inside that same `narrative` object. No React changes are required.

VTOL Aircraft also uses a concise narrative layout. Its page text is in `content/projects.json` under `"slug": "vtol"` → `lede`, `summary`, and `narrative`. Its current page images are:

- `public/media/vtol/vtol-airframe.png`
- `public/media/vtol/vtol-v2-cad.png`
- `public/media/vtol/vtol-wind-tunnel-mount.png`
- `public/media/vtol/vtol-test-rig-cad.png`
- `public/media/vtol/vtol-test-rig.png`

To replace or reorder these images later, update the matching `heroMedia`, `intro.media`, `mechanism.media`, `integration.media`, or `integration.secondaryMedia` entry inside the VTOL `narrative` object. No React changes are required.

H.A.R.R.Y. uses the same narrative layout. Its page text is in `content/projects.json` under `"slug": "harry"` → `lede`, `summary`, and `narrative`. Its current page images are:

- `public/media/harry/harry-full-robot.png`
- `public/media/harry/harry-chassis-lift.png`
- `public/media/harry/harry-shoulder-arm.png`
- `public/media/harry/harry-arm-prototype.png`

To replace or reorder these images later, update the matching `heroMedia`, `intro.media`, `mechanism.media`, or `integration.media` entry inside the H.A.R.R.Y. `narrative` object. No React changes are required.

Competition Robot uses a compact narrative layout. Its page text is in `content/projects.json` under `"slug": "vex"` → `lede`, `summary`, and `narrative`. Its current page image is:

- `public/media/vex/vex-competition-robot.png`

To replace it later, update `heroMedia` inside the Competition Robot `narrative` object. No React changes are required.

For any additional image beyond the configured slots, copy it into the matching project folder and add it to the project in `content/projects.json`.

To use it as the image on the Projects page card, add:

```json
"cover": {
  "src": "/media/nemo/nemo-cover.jpg",
  "alt": "NEMO humanoid robot standing in the lab"
}
```

To show images or video at the top of the project page, add items to the project's `media` list:

```json
"media": [
  {
    "type": "image",
    "src": "/media/nemo/nemo-overview.jpg",
    "alt": "NEMO humanoid robot standing in the lab",
    "caption": "Current NEMO prototype"
  }
]
```

To create a gallery inside a section, set that section's `layout` to `gallery` and add a `media` list to that section. Gallery images use the same project folder.

## 4. Add a video

Put the real `.mp4` or `.webm` file in the same project folder, then add:

```json
{
  "type": "video",
  "src": "/media/nemo/walking-test.mp4",
  "caption": "Walking test",
  "autoplay": false
}
```

Set `autoplay` to `true` for a muted, looping video. Keep it `false` for normal playback controls.

## 5. Add or change the optional hero image

The current hero intentionally uses no image. To add one later, put the real image in `public/media/hero/`, then replace `"heroMedia": null` in `content/site.json` with:

```json
"heroMedia": {
  "src": "/media/hero/hero-photo.webp",
  "alt": "Short literal description of the real image"
}
```

Change it back to `null` to remove the hero image.

## 6. Add a new project

1. Open `content/projects.json`.
2. Copy one complete project object, from its opening `{` to its closing `}`.
3. Paste it between two other project objects and keep a comma between objects.
4. Give it a unique lowercase `slug`, such as `robot-gripper`.
5. Set `group` to `projects`, `status` to `visible`, and choose a `priority` number.
6. Edit its title, description, page sections, and media.
7. Create a matching folder such as `public/media/robot-gripper/`.
8. Save the file. If `npm run dev` is running, the card, project page, and URL are generated automatically.

No React editing is required.

## 7. Delete or hide a project

Hiding is safer than deleting. Find the project in `content/projects.json` and change:

```json
"status": "visible"
```

to:

```json
"status": "hidden"
```

Save the file and the live preview will update automatically. To permanently delete it, remove the complete project object and its media folder.

## 8. Reorder projects

Change each project's `priority` number in `content/projects.json`. Lower numbers appear first. Save the file to update the live preview.

## 9. Update Ariel

Find `"slug": "ariel"` in `content/projects.json`.

- Change `summary` and `lede` when the approved project description is ready.
- Replace `projectState: "work-in-progress"` with the normal project fields and sections when you are ready to expand the page.
- Add `public/media/ariel/ariel-cover.avif` to replace the neutral card placeholder automatically.
- Add future images and videos inside `public/media/ariel/`.

The card remains intentionally image-free until you add the real cover file.

## 10. Update Zipline Projects

Find `"slug": "zipline-projects"` in `content/projects.json`.

1. Edit `summary` and `lede` with the approved overview text.
2. Add or update project-page objects inside `sections` for each project blurb.
3. Put approved media in `public/media/zipline-projects/`.
4. Add a `cover`, top-level `media`, or section-level `media` entries using those files.
5. Keep confidential or unapproved project details out of the public content file.
6. Save the file to update the live preview.

As long as you follow the existing JSON pattern, the Zipline page can be fully updated without editing React or JavaScript.

## 11. Replace the résumé

Replace `public/assets/Yashwanth_Muppidi_Resume.pdf` with the new PDF and keep the same filename. The Resume link will keep working.

If you use a different filename, also update the `resume` value in `content/site.json`.

## 12. Preview changes

From this repository folder, run:

```text
npm run dev
```

Open the local address shown in the terminal. Keep that terminal running while you edit.

Saving either content JSON file, the stylesheet, JavaScript, or anything under `public/` now automatically:

1. Rebuilds the site.
2. Refreshes the browser.

You no longer need to run `npm run build` after every edit. Press `Ctrl+C` in the running terminal when you are finished. Use `npm run build` by itself only when you want to generate the finished static site without starting the live preview.

If `npm` is not available in your terminal, use `node scripts/serve.mjs` instead. It provides the same live editing behavior. If port `4173` is already occupied, the preview automatically selects the next available port and prints the correct address.

## Available project-section layouts

- `text` — written section
- `diagram` — structured subsystem list
- `steps` — numbered process
- `media` — image or video area
- `gallery` — multiple images or videos
- `split` — paired media layout
- `results` — verified result values

Copy a section object to add a section, or remove a complete section object to delete one. The page layout is generated automatically.
