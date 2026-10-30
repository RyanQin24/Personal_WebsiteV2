# Editing Projects

The **Projects** navigation item opens `/projects`. It now uses a publication-style
list: your image on the left and project information on the right. On screens
767px wide or narrower, each image moves above its text.

All file paths below are relative to `F:\Paper\website_v2\plett.dev`.

## The two files you will usually edit

- **Content:** `app/(projects)/projects/content.ts`
- **Sizing and appearance:** `components/projects/Projects.module.css`

The `(projects)` folder is a Next.js route group; it does not appear in the URL.
The URL is still `/projects`.

## How the reference maps to your projects

| Reference section | Your project field |
| --- | --- |
| Publication image | `image` — your own project photo or screenshot. |
| Publication title | `title` — include the project name, hackathon, and award here. |
| Authors/contributors | `summary` — your short project description. |
| Venue/date | `technologies` — your existing rounded skill tags. |
| Resource links | `links` — visible labels, each followed by an arrow. |

Images stay non-clickable. Breadboard CPU has a dedicated Markdown page at
`/projects/breadboard-cpu`; its title and Details link both open that page.
Its linked title has no underline, including on hover. Other titles remain plain
text unless you explicitly set `detailsHref`. No detail pages, Website links, or
paper links are generated automatically. The layout follows the website's theme.

The current list contains TakeOne, Verilog AI processor, Breadboard CPU,
FPGA Clock, AutoDump, Competition RC, and BioTron, in that order.

## Change an existing project

Open `app/(projects)/projects/content.ts` and find its object in `projects`.

| Field | What to edit |
| --- | --- |
| `slug` | Unique internal row ID, such as `takeone`. It does not create a detail-page URL. Use lowercase letters, numbers, and hyphens. |
| `title` | Full visible heading, including any award and hackathon. For example, `TakeOne — Finalist at Hack the North 2026`. |
| `detailsHref` | Optional existing detail-page URL. This makes just that project's title clickable without an underline. Setting it does not create a page. |
| `summary` | A short description of what you built. One or two sentences work well. |
| `image.src` | Local image URL, such as `/images/projects/TakeOne_Proj.png`. |
| `image.alt` | A useful description of that specific image for people who cannot see it. |
| `image.fit` | `cover` fills the window while preserving the image's proportions and cropping overflow. `contain` shows the entire image with possible empty space. Default: `cover`. |
| `image.position` | Position within the window: `center`, `top`, or a value such as `50% 30%`. |
| `image.aspectRatio` | Optional frame ratio for this project only, such as `4 / 3`. Otherwise the global ratio is used. |
| `technologies` | Skill labels, for example `["FPGA", "Verilog", "Vivado"]`. |
| `links` | Optional list of `{ label, href }` entries. Their order controls the link order. |

These are plain text strings, not HTML or Markdown. Quotes and commas must remain
valid TypeScript. If a string contains a double quote, escape it as `\"` or use
single quotes around that string.

### Awards belong in the title

There is no separate subtitle field in this layout. Write the complete heading:

```ts
title: "My Project — Finalist at My Hackathon 2026",
```

For a project without an award, use just its name:

```ts
title: "FPGA Clock",
```

### Skill tags

Change, add, remove, or reorder strings in `technologies`:

```ts
technologies: ["C++", "FPGA", "Verilog"],
```

Use `technologies: []` to hide the skill row. Empty or whitespace-only labels are
ignored. Tags wrap automatically on narrow screens.

### Links and arrows

Each entry produces a labelled link with an arrow:

```ts
links: [
  { label: "GitHub", href: "https://github.com/your-name/your-project" },
  { label: "Video", href: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID" },
],
```

Replace the example URLs with your real destinations. The current projects retain
their existing DevPost, GitHub, YouTube, and DoraHacks links. The Verilog processor
currently has no links.

Use `links: []` or omit `links` to hide the link row. You can include one or several
links; every link gets the same arrow. Full HTTP(S) URLs open in a new tab with
`noopener noreferrer`. Internal paths beginning with `/` stay in the same tab.
Blank labels and invalid URLs are omitted.

No link is inferred from an image or slug. A title links only when `detailsHref`
is supplied. Add a Website link only if you actually have a destination and want
to include one.

### Breadboard CPU detail page

The supplied README is copied unchanged to `content/projects/breadboard-cpu.md`.
Edit that file to change the article. The title's `detailsHref` and the resource
link labelled `Details` use `PATH_BREADBOARD_CPU` from `lib/constants.ts`, pointing
to `/projects/breadboard-cpu`.

See [the Breadboard CPU page guide](breadboard-cpu.md) for its Markdown, images,
and responsive article-style settings.

## Images and image sizing

Put image files in `public/images/projects/`. For a file at:

```text
public/images/projects/my-project.webp
```

use this browser path:

```ts
image: {
  src: "/images/projects/my-project.webp",
  alt: "Describe what the image shows.",
  fit: "cover",
  position: "center",
},
```

Do not put `public` or a Windows drive path in `src`. Match capitalization exactly,
including `.jpg` versus `.JPG`, so it also works on a case-sensitive hosting system.

The default image window is **16:9**. Its height follows its width automatically.
All current projects use `cover`: the image scales proportionally until both
window dimensions are filled, and any overflow is cropped. This removes
letterboxing without stretching the photo. Use `image.position` to choose which
part stays visible, for example `"center"`, `"top"`, or `"50% 30%"`.

Choose `contain` only when you want the whole image visible and accept empty
space around it.

For a different window ratio on just one project, add:

```ts
image: {
  src: "/images/projects/my-project.webp",
  alt: "Describe the image.",
  fit: "cover",
  position: "50% 30%",
  aspectRatio: "4 / 3",
},
```

To make **all** desktop images wider, change `--project-image-width` in the CSS.
It is an upper limit: the image column is also capped by `--project-image-share`
to leave room for text on smaller desktop/tablet screens. On mobile the image
uses the full row width.

If you substantially change the image-width cap, also update the `sizes` hint in
`components/projects/ProjectCard.tsx` so Next.js requests an appropriately sized
image. The hint affects image-download selection, not the visual layout.

If replacing an image leaves a cached copy visible, save it under a new filename
and update `image.src`.

## Sizing and spacing parameters

Open `components/projects/Projects.module.css`. The editable settings are grouped
at the top in `.page`:

| Setting | Default | Purpose |
| --- | --- | --- |
| `--projects-max-width` | `1100px` | Maximum width of the Projects content. |
| `--projects-heading-size` | `24px` | Projects page-heading font size. |
| `--projects-heading-gap` | `36px` | Space below the page heading. |
| `--project-title-size` | `18px` | Project title font size. |
| `--project-description-size` | `14px` | Short-description font size. |
| `--project-tag-size` | `12px` | Skill-tag font size. |
| `--project-link-size` | `14px` | Link-label font size. |
| `--project-image-width` | `320px` | Maximum desktop image-column width. |
| `--project-image-share` | `34%` | Maximum share of a desktop row occupied by the image. |
| `--project-image-ratio` | `16 / 9` | Default window aspect ratio; height follows width. |
| `--project-image-radius` | `8px` | Rounded image corners. |
| `--project-column-gap` | `28px` | Horizontal gap between image and text. |
| `--project-row-padding` | `28px` | Space above/below each row and its divider. |
| `--project-content-gap` | `10px` | Gap between title, description, skills, and links. |
| `--project-footer-bottom-gap` | `0px` | Desktop distance between the bottom of the skills/links group and the image bottom. Increase to lift the group; `0px` aligns their bottoms. |
| `--project-mobile-gap` | `16px` | Gap between image and text when stacked. |
| `--project-tag-gap` | `6px` | Space between skill tags. |
| `--project-tag-padding-x` | `8px` | Padding inside tags on the left/right. |
| `--project-tag-padding-y` | `3px` | Padding inside tags above/below text. |
| `--project-tag-radius` | `5px` | Rounded tag corners. |
| `--project-link-gap` | `14px` | Horizontal gap between links. |
| `--project-arrow-size` | `14px` | Arrow icon dimensions. |
| `--project-arrow-stroke` | `0.5` | Extra arrow weight; increase slightly for a bolder arrow. |

The desktop/mobile breakpoint is the `@media (max-width: 767px)` rule at the bottom.
The outer page gutters come from the shared `Container` component. Colors use the
website's background, foreground, muted, and border variables for both themes.
The Projects rows use the locally bundled Inter Variable font.

### Align skills and links with the image bottom

On desktop, skills and links form one group anchored to the bottom of the row.
Their existing vertical gap is preserved by `--project-content-gap`.

Change this setting near the top of `Projects.module.css`:

```css
--project-footer-bottom-gap: 0px;
```

`0px` aligns the group's bottom with the image bottom when the image is taller
than the text content. Set `8px` to move the group 8px higher; use a non-negative
length. If a long description or wrapped tags need more height than the image,
the row expands naturally so nothing overlaps. On mobile, the group follows the
description normally and this desktop bottom gap is not applied.

## Add a project

Copy an existing complete object inside the `projects` array, then edit it. This
example uses an existing image so it renders immediately; replace the example
text and image before publishing:

```ts
{
  slug: "my-new-project",
  title: "My New Project — Award at Event",
  summary: "Describe what you built and what it does.",
  image: {
    src: "/images/projects/TakeOne_Proj.png",
    alt: "Replace this with a description of your image.",
    fit: "cover",
    position: "center",
  },
  technologies: ["C++", "FPGA"],
  links: [],
},
```

1. Give it a unique `slug`.
2. Write its title and short description.
3. Add your image and update `image.src` and `image.alt`.
4. Enter skills in `technologies`.
5. Add real link entries, or leave `links: []`.
6. Save the file. No new React page or component is needed.

Move whole objects up/down to reorder them. Remove a complete object to take it
off the page. Delete an image file only after confirming that no remaining entry
uses it.

## Previous projects and removed detail pages

The previous data is saved in:

```text
docs/archive/projects-before-publication-layout.json
```

That file is an archive and is not imported or displayed by the website. You can
restore a project by copying its title, summary, image, technologies, and links
into a new object in the current content file. Use the new field structure above:
put any former award subtitle into `title`, and omit the old `subtitle` and
`sections` fields.

The old generic `/projects/<slug>` detail-page template was removed. Breadboard
CPU now has its own explicit Markdown page and sitemap entry. Other detail pages
are not created from the array; project links go to the URLs you supply.

## File map

| File | Purpose |
| --- | --- |
| `app/(projects)/projects/content.ts` | All current project data and order. |
| `app/(projects)/projects/page.tsx` | Page heading and metadata. |
| `app/(projects)/projects/breadboard-cpu/page.tsx` | Breadboard CPU Markdown rendering and page metadata. |
| `content/projects/breadboard-cpu.md` | Breadboard CPU article text. |
| `components/projects/ProjectReadme.module.css` | Responsive article, diagram, and code-block styles. |
| `app/(projects)/layout.tsx` | Uses the site's wide container for this route. |
| `components/projects/ProjectCard.tsx` | Row markup, image window, and skill tags. |
| `components/projects/ProjectLinks.tsx` | Labelled resource links and arrow icons. |
| `components/projects/Projects.module.css` | All row, font, image, spacing, and theme styling. |
| `components/projects/types.ts` | TypeScript data fields. |
| `public/images/projects/` | Your project photos/screenshots. |

With your development server already running, saved changes normally appear
through hot reload. Production/hosted sites require a new build and deployment.
Use the workspace's `site.ps1` workflow when you choose to run or build the site;
keep its runtime and caches inside `F:\Paper\website_v2`.

Layout reference: [Yutong Liang's Selected Publications](https://www.lyt0112.com/).
The reference supplies the layout idea; the images, descriptions, skills, and
resource links on your Projects page are your own.
