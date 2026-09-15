# Editing your portfolio

You do not need to edit the website layout to update the portfolio. Almost all text and project information lives in two plain files:

- `content/site.json` — your name, introduction, About text, experience, education, links, and résumé path
- `content/projects.json` — every personal, academic, and Zipline project

JSON is picky about commas and quotation marks. Keep the existing punctuation pattern when you edit a value.

## 1. Change text

Open `content/site.json` for general site text or `content/projects.json` for project text. Change only the words between quotation marks, then save the file.

## 2. Replace an image

Put the new image in the matching folder inside `public/images/`. Use short lowercase filenames without spaces, such as `nemo-knee-cad.webp`.

In the project’s `media` list, change the `src` value to the new path:

```json
"media": [
  {
    "type": "image",
    "src": "/images/nemo/nemo-knee-cad.webp",
    "alt": "CAD view of the revised NEMO knee assembly",
    "caption": "Revised knee assembly"
  }
]
```

Use `.webp` or `.jpg` for photos and renders when possible. Write a short, literal `alt` description for accessibility.

## 3. Add images to a project

Add another item inside the project’s `media` list. Put a comma between items:

```json
"media": [
  {
    "type": "image",
    "src": "/images/vtol/airframe.webp",
    "alt": "Assembled VTOL airframe on a workbench",
    "caption": "Airframe assembly before systems integration"
  },
  {
    "type": "image",
    "src": "/images/vtol/tilt-mechanism.webp",
    "alt": "Close view of the tilt-rotor mechanism",
    "caption": "Tilt mechanism prototype"
  }
]
```

You can also add a `media` list to an individual section if an image belongs under a specific heading.

## 4. Add a video

Copy an `.mp4` or `.webm` file into the project image folder, then add:

```json
{
  "type": "video",
  "src": "/images/nemo/walking-test.mp4",
  "caption": "Early walking test",
  "autoplay": true
}
```

With `autoplay` set to `true`, the video plays silently and loops. Set it to `false` if you want normal video controls.

## 5. Create a new project

1. Open `content/projects.json`.
2. Copy one complete project object, including its opening and closing braces.
3. Paste it after another project and add a comma between the two objects.
4. Give it a unique lowercase `slug`, such as `new-gripper`.
5. Update the title, group, dates, summary, tools, and sections.
6. Create `public/images/new-gripper/` for its media.
7. Run `npm run build`. The project page and its route are created automatically.

Use `"group": "projects"` for primary engineering projects, `"group": "additional"` for smaller older work, or `"group": "zipline"` for a Zipline project.

## 6. Delete or hide a project

The safest choice is to hide it. Change:

```json
"status": "visible"
```

to:

```json
"status": "hidden"
```

Then run `npm run build`. To permanently delete it, remove the entire project object from `content/projects.json` and remove its image folder.

## 7. Reorder projects

Change the `priority` number. Lower numbers appear first. Each project group is ordered separately.

## 8. Feature a project on the homepage

Set:

```json
"featured": true
```

Set it to `false` to remove the project from the large homepage selection. NEMO always receives the flagship treatment when visible.

## 9. Add another Zipline project

Copy either existing Zipline project object, give it a new unique `slug`, keep `"group": "zipline"`, and edit only with language and media approved for public use. Run `npm run build` to create its project page automatically.

## 10. Edit Experience

Open `content/site.json` and find the `experience` list. Edit an existing entry or copy one to add another. A `link` is optional; use it to connect an experience to related work, such as `/work/nemo/`.

## 11. Edit About

Open `content/site.json` and edit the two paragraphs under `about`. The three items under `principles` control the “How I work” section.

## 12. Replace the résumé

Replace `public/assets/Yashwanth_Muppidi_Resume.pdf` with your real PDF. Keep the same filename and the Resume link will continue to work everywhere. If you prefer another filename, update the `resume` value in `content/site.json` too.

## 13. Preview changes locally

Install Node.js if it is not already installed. Open a terminal in this folder, then run:

```text
npm run build
npm run dev
```

Open the local address printed in the terminal. Stop the preview with `Ctrl+C`.

Run `npm run build` again after changing content. The finished static website is placed in `dist/`.

## Section layouts available

Each case-study section has a `layout` value. You can use:

- `text` — short written section
- `diagram` — a structured list of connected subsystems
- `steps` — numbered design or test sequence
- `media` — large image or video area
- `gallery` — several images or videos
- `split` — media intended for a paired layout
- `results` — verified results or metrics

Delete a section you do not need. Copy a section to add another one. The page builds from the list automatically.
