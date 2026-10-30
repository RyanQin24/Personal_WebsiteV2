# Default DSP music

Add your mono or stereo `.wav` files directly to this folder:

```text
F:\Paper\website_v2\plett.dev\public\music
```

The DSP page's **Default music** combobox automatically lists WAV files in this
folder. Subfolders and non-WAV files are ignored. Spaces and punctuation in
filenames are supported. Descriptive names such as `My Track.wav` make the list
easier to use.

## Updating the library

- **Local development:** the list refreshes every 10 seconds while visible and
  when you return to the tab. Use **Refresh** to check immediately after adding,
  renaming, or removing a WAV file.
- **Vercel / production:** Next.js generates `/api/music` as static JSON during
  `pnpm build`. Add, rename, or remove WAV files, commit and push the changes, and
  let Vercel redeploy. **Refresh** retrieves the catalog for the current deployment;
  it cannot discover files that have not been deployed yet.
- **Playback:** each track loads directly from `/music/<encoded filename>.wav`.
  Audio files are static assets and are excluded from server function bundles.
  Playback, the VU meters, and FFT processing run in the visitor's browser.

Files in this folder are part of the website and are available to its visitors.
The combobox does not browse a visitor's computer or upload their local files.
