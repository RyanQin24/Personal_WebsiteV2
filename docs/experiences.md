# Editing the Experiences page

The **Experiences** navigation item opens `/about`. The page's **Work Experience**
list is controlled by one file:

```text
F:\Paper\website_v2\plett.dev\app\(home)\about\content.ts
```

Edit the objects in its `experiences` array to change the content. You do not need
to copy a React component to add another experience.

## Where everything lives

Paths below are relative to `F:\Paper\website_v2\plett.dev`.

| File or folder | Purpose |
| --- | --- |
| `app/(home)/about/content.ts` | Roles, companies, dates, skill tags, locations, links, logo references, and display order. |
| `app/(home)/about/page.tsx` | Page heading and browser/search metadata. |
| `components/experiences/types.ts` | TypeScript fields accepted by each experience. |
| `components/experiences/ExperienceList.tsx` | Shared markup for every experience. |
| `components/experiences/Experiences.module.css` | Responsive layout, typography, spacing, theme colors, and logo sizing. |
| `public/images/companies/` | Local company logo files. |
| `public/fonts/reference-experience/` | The reference site's Inter Variable font, license, and source notes. |
| `components/layouts/Navigation.tsx` | The Experiences navigation label. |

## Edit an existing experience

Find the object by its `company` or `role`, then change the relevant field:

| Field | What it changes |
| --- | --- |
| `id` | Unique internal identifier for the entry. Use lowercase words separated by hyphens. |
| `role` | Role text before `@`. This text is not a link. |
| `company` | Company name used by the linked logo's accessible label and tooltip. It is not displayed as title text; keep this field filled in. |
| `companyUrl` | The company's full website URL, normally beginning with `https://`. |
| `period` | Date text shown at the left on desktop and above the entry on mobile. |
| `skills` | Array of short labels displayed as rounded tags immediately below the title. |
| `location` | Optional location on its own line below the skill tags. |
| `logo.src` | Browser path to the local company logo, such as `/images/companies/amd.svg`. |
| `logo.width`, `logo.height` | The source image's natural dimensions, used to preserve its aspect ratio. Leave these unchanged when resizing the displayed logo. |
| `logo.size` | Optional display size with exactly one dimension: `{ height: "1.4em" }` or `{ width: "90px" }`. The other dimension scales automatically. |
| `logo.appearance` | Optional `"monochrome"` or `"original"`. Omit it for a theme-colored mask; use `"original"` to show the asset's actual colors. |
| `logo.offsetX` | Optional horizontal logo offset in `em`, relative to the title text. Positive moves right; negative moves left. Default: `0`. |
| `logo.offsetY` | Optional vertical logo offset in `em`. Positive moves down; negative moves up. Default: `0`. |

Text fields and skill labels are plain strings. Do not insert HTML or Markdown
formatting into them. Put only the location in `location`.

### Edit skill tags

Some entries may still have these temporary labels:

```ts
skills: ["i1", "i2", "i3", "i4", "i5"],
```

Replace the strings with the skills or tools used in that role, for example:

```ts
skills: ["C++", "C#", "Python"],
```

Add another string to add a tag, remove a string to remove one, or move strings
within the array to change their order. Use `skills: []` to hide the tags without
leaving an empty tag row. The tags replace the full-sentence description; there
is no separate hidden description field to maintain.

Tags are display labels, not buttons or links. They wrap onto another line on
small screens and use the website's theme colors in both light and dark mode.
In `components/experiences/Experiences.module.css`, `.skills` controls the group
spacing and wrapping; `.skill` controls each tag's padding, background, and
rounded corners.

### Adjust skill-tag size, alignment, and spacing

Open **`components/experiences/Experiences.module.css`** and edit the named
settings in `.page` near the top. The compact defaults are:

| Setting | Default | What it changes |
| --- | --- | --- |
| `--experience-skills-margin-top` | `6px` | Space between the title and the skill-tag row. |
| `--experience-skills-offset-x` | `0px` | Horizontal position of the whole tag row. Zero aligns the first label's text with the title; positive values indent right and negative values move left. |
| `--experience-skills-gap-x` | `6px` | Horizontal space between tags. |
| `--experience-skills-gap-y` | `4px` | Vertical space between wrapped rows of tags. |
| `--experience-skill-padding-x` | `6px` | Space inside each tag, to the left and right of its label. |
| `--experience-skill-padding-y` | `2px` | Space inside each tag, above and below its label. |
| `--experience-skill-line-height` | `1.25` | Unitless text line height inside each tag. |
| `--experience-skill-radius` | `5px` | Roundness of the tag corners. |
| `--experience-skill-size` | `12px` | Skill-label font size. |

Reduce the padding to make each box smaller. Reduce `margin-top` to move the row
closer to the title; change the gap settings to bring separate boxes closer
together. The group has no list padding. Its starting margin automatically
subtracts the tag's horizontal padding, so `offset-x: 0px` aligns the first
label's text with the title while the background box extends left by that
padding. To align the first box's outer edge instead, set `offset-x` to the
same value as `padding-x` (for example, `6px`).

These controls apply to all experience entries and both themes. Tags still wrap
on narrow screens.

### Locations

Location is optional. Omit `location` or set `location: ""` while you are filling
in the details. An empty location does not create an empty line.

When known, use your own role's location, for example the city/region or a remote
arrangement. The initial reference page did not provide locations, so the list
does not infer them from company headquarters.

### Dates and order

`period` is editable text; it does not query another website. Update that field
whenever a role's dates or current status change. The content file includes your
subsequent edits, so the reference page does not override it.

Move whole objects within the array to change their display order. The first
object appears first. Entries are not automatically sorted by date.

## Change a company logo

1. Put the logo file inside `public/images/companies/`.
2. Set `logo.src` to its browser path, starting with `/images/companies/`.
   Do not include `public` or a Windows drive path in the URL.
3. Set `width` and `height` to the original asset's dimensions. For an SVG, use
   the width and height of its `viewBox`; for a raster file, use its pixel size.
4. Optionally set `logo.size` to control its displayed height or width.
5. Save the content file and refresh the page if needed.

Titles display the role followed by `@` and the linked logo, with no visible
company name. Without a `size` setting, logos use a height of `1em`, approximately
the same height as the title text. Their width follows the supplied aspect ratio,
so wide wordmarks and square symbols can share the same text-height alignment.

By default, the logo is displayed as a **CSS mask**: its opaque shape takes the
current text color, while transparent areas remain transparent. This keeps it
visible in both light and dark themes. Use a transparent SVG or PNG with a clean
silhouette for `appearance: "monochrome"` (the default). An image with an opaque
rectangular background would produce a solid rectangle in this mode.

For a full-color logo or banner with a background, set `appearance: "original"`
inside `logo`. This displays the original image and its colors instead of using
a mask, while retaining its text-height sizing and natural aspect ratio.

Keep `company` filled in even though it is not shown in the title. It names the
logo link for screen-reader users and supplies its tooltip. The role text itself
is not a link; the logo opens `companyUrl`.

The AMD, ATS, and WSP images use the original assets from your previous site's
`experiences_assets/` folder, displayed with `appearance: "original"`. Their
source details are recorded in `public/images/companies/README.md`.

If you replace a logo and a cached copy persists, save the replacement under a
new filename and update `logo.src`.

### Resize a logo without stretching it

Change **only `logo.size`** to resize a logo. The separate `logo.width` and
`logo.height` fields describe the original image's proportions; they are not
display-size controls.

For a fixed height with automatic width:

```ts
logo: {
  src: "/images/companies/your-company.png",
  width: 240,  // Original image width; leave unchanged when resizing.
  height: 80,  // Original image height; leave unchanged when resizing.
  size: { height: "1.4em" },
  appearance: "original",
},
```

For a fixed width with automatic height, replace only the `size` line:

```ts
size: { width: "90px" },
```

Choose one dimension, not both. TypeScript prevents setting `size.width` and
`size.height` together. Use a positive CSS length such as `"24px"`, `"1.4em"`, or
`"1.5rem"`; use `em` when the logo should scale with the title's font size. For
the example's 3:1 source image, a height of `24px` produces a width of `72px`.

Omitting `size` uses `{ height: "1em" }`. The same sizing rules apply to both
`"original"` images and `"monochrome"` masks. Position offsets remain separate
from size, so resizing does not replace your `offsetX` or `offsetY` values.

### Adjust the logo's relative position

Edit `offsetX` and `offsetY` inside that experience's `logo` object:

```ts
logo: {
  src: "/images/companies/your-company.png",
  width: 240,
  height: 80,
  size: { height: "1em" },
  appearance: "original",
  offsetX: 0.2,  // Move right by 0.2 times the title font size.
  offsetY: -0.1, // Move up by 0.1 times the title font size.
},
```

These values use `em`, so the adjustment scales with the title font size.
Positive X moves right and negative X moves left; positive Y moves down and
negative Y moves up. Omitting either field uses zero. Existing per-logo offsets
can be kept when changing `size`.

The offset moves the linked logo, its clickable area, and its keyboard focus
outline together. It does not change the text flow or row height. Use small
adjustments so the logo does not overlap the role or nearby content.

## Add another experience

Add an object inside the `experiences` array. This is a structural example:
replace its text, URL, logo path, and logo dimensions with your actual details.

```ts
{
  id: "my-new-experience",
  role: "Your role",
  company: "Your company",
  companyUrl: "https://example.com/",
  period: "2026",
  skills: ["i1", "i2", "i3", "i4", "i5"],
  location: "",
  logo: {
    src: "/images/companies/your-company.svg",
    width: 240,
    height: 80,
    size: { height: "1em" },
    offsetX: 0,
    offsetY: 0,
  },
},
```

Keep commas between objects and strings. Give each entry a unique `id`.

To remove an experience, delete its complete object from the array. Remove an
old logo file only after checking that no remaining entry uses it.

## Change the font or text size

The Experiences section uses **Inter Variable**, the same font identified in
[the reference website](https://work.jaryddiamond.com/) and its
[stylesheet](https://work.jaryddiamond.com/assets/app-BQn2OoVR.css). The local font
supports weights from 100 to 900. Its files, `LICENSE.txt`, and source notes are
in `public/fonts/reference-experience/`.

Open **`components/experiences/Experiences.module.css`**. The `.page` settings
near the top control the font and sizes for the whole Experiences section:

```css
--experience-font-family: "Inter Variable", ui-sans-serif, system-ui,
  -apple-system, sans-serif;
--experience-heading-size: 14px;
--experience-title-size: 16px;
--experience-skill-size: 12px;
--experience-date-size: 14px;
--experience-location-size: 14px;
```

| Setting | Text it controls |
| --- | --- |
| `--experience-font-family` | The section's font and fallback fonts. |
| `--experience-heading-size` | The Work Experience heading. |
| `--experience-title-size` | Role titles and the base size for `em` logo sizing. |
| `--experience-skill-size` | Skill labels inside the rounded tags. |
| `--experience-date-size` | The date ranges. |
| `--experience-location-size` | Locations beneath the skill tags. |

Role titles use weight `500` and a `1.5` line height: 16px text produces a 24px
line. The section heading also uses weight `500`; dates and locations use weight
`400`. Their 14px text has approximately a 20px line height. Skill tags use 12px
text by default. Adjust `font-weight` or `line-height` in the corresponding
`.title`, `.heading`, `.skill`, `.period`, or `.location` rule when needed. Letter
spacing is normal.

These font sizes apply on desktop and mobile. The layout still moves dates above
the role on narrow screens. Changing the title size also scales logo sizes and
position offsets expressed in `em`; pixel-based logo sizes keep their set size.

## Adjust the layout

The desktop layout shares a date column sized to its longest date label, keeping
date ranges on one line and all role titles aligned. The rows use CSS subgrid to
share those column widths. The remaining space belongs to the role and skill tags.

The date and title share their first text baseline through `.entry`'s
`align-items: first baseline`. This also works when a larger logo increases the
title line's height; a manual date padding or offset is not needed. On mobile,
the entries return to `align-items: start` because the date is above the title.

At widths of 639px or less, each date moves above its role so the text can use the
full available width. Dates may wrap on these narrow screens when necessary.
Titles, logos, and skill tags can wrap rather than extending off the screen.

Use `components/experiences/Experiences.module.css` for font sizes, column widths,
spacing, and the mobile breakpoint. Retain the website's existing theme variables
when changing colors so both light and dark mode continue to work.

## Reference sources

The initial AMD, ATS, WSP, and Midnight Sun role details referenced
[Ryan Qin's previous Experiences page](https://www.ryanqin.com/experiences.html).
The page is a factual reference; its paragraphs and visual layout were not copied.
Any remaining skill-tag placeholders can be replaced with your own labels.

Company links point to their official websites:

- [AMD](https://www.amd.com/)
- [ATS Corporation](https://atsautomation.com/)
- [WSP](https://www.wsp.com/)
- [Midnight Sun](https://www.uwmidsun.com/)

## When saved changes appear

With the development server already running, saved content and style edits
normally appear through the existing development workflow. Refresh if needed.

A production or hosted website needs a new build and deployment after changing
source content or bundled images. Use the workspace's `site.ps1` workflow when
you choose to run or build the website; keep runtimes, caches, and temporary files
inside `F:\Paper\website_v2`.
