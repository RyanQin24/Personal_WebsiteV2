# Ryan Qin's Personal Website

Source code for Ryan Qin's portfolio at [ryanqin.com](https://ryanqin.com).

### Tech

- Framework: [Next.js](https://nextjs.org/)
- Hosting: [Vercel](https://vercel.com)
- Styling: [shadcn/ui](https://ui.shadcn.com/) with [Tailwind CSS](https://tailwindcss.com)
- Database: [Redis](https://redis.io/) with [Upstash](https://upstash.com/)
- Design: [Figma](https://figma.com)

### Features

- Statically generated posts from markdown, with search engine optimization ([writing](https://ryanqin.com/writing)).
- Stories written in Markdown, including [Leo & Cate](https://ryanqin.com/Leo&Cate) with an interactive terminal.
- WAV playback from a default music library or your own files, with stereo analog VU meters, adjustable RC response, and a live FFT spectrum analyzer.
- Thoroughly tested responsive design and ARIA compliance.

### Editing Projects

The Projects tab opens the local `/projects` page. Edit its project rows in
[`app/(projects)/projects/content.ts`](<app/(projects)/projects/content.ts>).
Add project images to `public/images/projects/`.

See the [Projects editing guide](docs/projects.md) for a complete example, all
editable fields, image sizing, links, and instructions for adding or removing projects.

### Editing Experiences

Edit [`app/(home)/about/content.ts`](<app/(home)/about/content.ts>) to change roles,
dates, summaries, locations, and company links. See the
[Experiences editing guide](docs/experiences.md) for logo settings and adding entries.

### Default DSP music

Add mono or stereo `.wav` files directly to `public/music/`. The DSP page lists them
in the **Default music** combobox. During local development, the list refreshes
every 10 seconds while the page is visible, when you return to the tab, or when you
click **Refresh**. On Vercel, the catalog is generated during each production build:
commit and push added, renamed, or removed tracks to update the deployed library.

WAV files are served directly as static `/music/...` assets, outside server functions.
Choose a track, then press **Play**. The separate **My WAV** button loads a file from
your device. See [the music folder guide](public/music/README.md) for details.

<details>
<summary>Developer to-dos</summary>
<br>

- [x] Solve Next.js security vulnerability by upgrading to Next.js 16 ([resource](https://vercel.com/kb/bulletin/react2shell#how-to-upgrade-for-next.js))
- [ ] Improve metadata on all pages by fixing SSG metadata, and using SEO tools beyond metadata and sitemaps.
- [ ] Hook up Vercel Analytics and then Use the data to inform my next updates.
- [x] Allow book contents to be written entirely in markdown.
  - [x] Make the actual introduction separate, and above the main titles.
    - [ ] Include an inline image in the primary intro, showing progression.
  - [x] Decide if I even want pseudocode at all (it's a lot of work)...
    - [x] Remove pseudocode from the plan.
  - [x] Gutter citations.
    - [x] Ensure they change when the screen gets smaller.
  - [x] On mobile, ensure images are in the correct spot between paragraphs, not clumped at the end.
    - [x] Remove images from the right column on big screens.
  - [x] Show on my Writing page.
  - [x] Dynamic reading time estimates.
  - [ ] Display books using cards.
  - [ ] Fix up the Posts & Books display code, and fix old writing->posts redirecting.
  - [ ] (After writing) Toss in relevant links throughout (in the form of citations?).

</details>

### License

This portfolio is adapted from [plettj/plett.dev](https://github.com/plettj/plett.dev)
by Josiah Plett. The original template's terms are retained below:

1. If you intend to copy much of this website, simply fork the repo, and remove all my personal text and files before you deploy.
2. Drop a star and credit me if you found this repo useful. :-]
3. Otherwise, enjoy!
