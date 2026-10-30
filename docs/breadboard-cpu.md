# Editing the Breadboard CPU page

The article is available at **`/projects/breadboard-cpu`**. The Breadboard CPU title
and the link labelled **Details** on the Projects list open it in the same tab.
The title remains free of underlining, including on hover and keyboard focus.

## Article content

Edit this file, relative to `F:\Paper\website_v2\plett.dev`:

```text
content/projects/breadboard-cpu.md
```

It is an unchanged copy of the README you supplied. The external original file
is not modified or automatically synchronized; edit the copy inside the website
for future updates. The page renders its Markdown headings, paragraphs, lists,
links, assembly code, and raw HTML image tags.

The first `#` heading in the Markdown supplies the visible article heading. The
browser title and description are set in
`app/(projects)/projects/breadboard-cpu/page.tsx`.

## Images and diagrams

The ten original image files are bundled in:

```text
public/images/projects/breadboard-cpu/
```

`content/projects/breadboard-cpu-assets.json` maps the original GitHub image URLs
to those local files. This keeps the supplied Markdown unchanged while serving
its existing diagrams locally. Image provenance is recorded in that image
folder's `README.md`.

For a new image, put it in the folder and use its local browser path directly:

```md
![Description of the circuit](/images/projects/breadboard-cpu/my-diagram.png)
```

Raw HTML also works:

```html
<img src="/images/projects/breadboard-cpu/my-diagram.png" alt="Description of the circuit" />
```

Images retain their aspect ratios and shrink to the available article width.
The article does not crop diagrams. The original large `width`/`height`
attributes in the README do not force a phone page to overflow.

## Size and formatting controls

Open `components/projects/ProjectReadme.module.css`. Settings near the top:

```css
--readme-max-width: 900px;
--readme-body-size: 15px;
--readme-code-size: 13px;
--readme-image-radius: 6px;
```

- `--readme-max-width`: maximum article width; it still shrinks on mobile.
- `--readme-body-size`: paragraph and list text size.
- `--readme-code-size`: assembly/code-block font size.
- `--readme-image-radius`: image corner rounding.

Heading sizes are in `.markdown h1`, `h2`, `h3`, and `h4`. Long code lines scroll
inside their code block, rather than making the whole page wider. Colors follow
the site's light/dark theme. The Projects layout supplies the shared font,
navigation, and footer.

## Project-list links

The Breadboard CPU object is in `app/(projects)/projects/content.ts`:

```ts
detailsHref: PATH_BREADBOARD_CPU,
links: [
  { label: "Details", href: PATH_BREADBOARD_CPU },
  // Other existing links can stay here.
],
```

`PATH_BREADBOARD_CPU` is defined in `lib/constants.ts`. The optional `detailsHref`
field controls whether a project title links somewhere; it does not create a
route automatically. Other project titles remain plain text.

Refresh the page after editing Markdown. A production deployment requires a new
build/redeployment to include changed content or new bundled images.
