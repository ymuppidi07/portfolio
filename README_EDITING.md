# Editing this portfolio

Routine content updates do not require React or layout code. This site is a small static site driven by two editable JSON files:

- `content/site.json` — Home, About, Experience, navigation links, footer, and résumé path
- `content/projects.json` — project cards, project order, project descriptions, and every project page

JSON requires double quotation marks and commas between items. When editing, copy the punctuation pattern already in the file.

## Where each kind of content lives

| Content | Exact location |
| --- | --- |
| Homepage hero and short About Me text | `content/site.json` → `eyebrow`, `headline`, `disciplines`, and `home` |
| Full About page | `content/site.json` → `aboutPage`, `about`, and `principles` |
| Projects page heading | `content/site.json` → `projectsPage` |
| Project titles and card descriptions | `content/projects.json` → each project's `title` and `summary` |
| Project-page introductions and sections | `content/projects.json` → `lede`, `role`, `tools`, `media`, and `sections` |
| Experience page | `content/site.json` → `experiencePage`, `experience`, and `education` |
| Project images, galleries, and project videos | `public/media/<project-slug>/` |
| Optional hero image | `public/media/hero/` |
| Résumé PDF | `public/assets/Yashwanth_Muppidi_Resume.pdf` |

The existing project media folders are:

- `public/media/nemo/`
- `public/media/ariel/`
- `public/media/third-thumb/`
- `public/media/vtol/`
- `public/media/harry/`
- `public/media/vex/`
- `public/media/fountain-pen/`

## 1. Change text

Open `content/site.json` for general page text or `content/projects.json` for project text. Change the words between quotation marks and save.

Examples:

- Homepage About Me paragraph: `content/site.json` → `home.aboutText`
- Full About paragraphs: `content/site.json` → `about`
- Experience entries: `content/site.json` → `experience`
- NEMO description: `content/projects.json` → find `"slug": "nemo"`, then edit `summary`, `lede`, or `sections`

## 2. Replace an existing image

The easiest method is to replace the file in `public/media/<project-slug>/` with a new file that has the same filename. No JSON change is needed.

If the new filename is different, update its `src` value in `content/projects.json` too.

## 3. Add a new image

First copy the real image into the matching project folder. Then add it to the project in `content/projects.json`.

To use it as the image on the Projects page card, add:

```json
"cover": {
  "src": "/media/nemo/nemo-overview.webp",
  "alt": "NEMO humanoid robot standing in the lab"
}
```

To show images or video at the top of the project page, add items to the project's `media` list:

```json
"media": [
  {
    "type": "image",
    "src": "/media/nemo/nemo-overview.webp",
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
8. Run `npm run build`. The card, project page, and URL are generated automatically.

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

Then run `npm run build`. To permanently delete it, remove the complete project object and its media folder.

## 8. Reorder projects

Change each project's `priority` number in `content/projects.json`. Lower numbers appear first. Run `npm run build` afterward.

## 9. Update Ariel later

Find `"slug": "ariel"` in `content/projects.json`.

1. Change `summary` and `lede` from `Work in Progress` to your real text.
2. Change `projectState` from `work-in-progress` to `complete`.
3. Add your real `year`, `organization`, `role`, and `tools` values.
4. Add project-page objects inside `sections`.
5. Put real Ariel media in `public/media/ariel/` and add `cover`, `media`, or section-level `media` entries.
6. Run `npm run build`.

As long as you follow the existing JSON pattern, Ariel can be fully updated without editing React or JavaScript.

## 10. Replace the résumé

Replace `public/assets/Yashwanth_Muppidi_Resume.pdf` with the new PDF and keep the same filename. The Resume link will keep working.

If you use a different filename, also update the `resume` value in `content/site.json`.

## 11. Preview changes

From this repository folder, run:

```text
npm run build
npm run dev
```

Open the local address shown in the terminal. Run `npm run build` again after content edits. The finished static site is generated in `dist/`.

## Available project-section layouts

- `text` — written section
- `diagram` — structured subsystem list
- `steps` — numbered process
- `media` — image or video area
- `gallery` — multiple images or videos
- `split` — paired media layout
- `results` — verified result values

Copy a section object to add a section, or remove a complete section object to delete one. The page layout is generated automatically.
