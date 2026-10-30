import { lstat, readdir } from "node:fs/promises";
import { join } from "node:path";

export type MusicTrack = {
  filename: string;
  title: string;
  url: string;
};

function isMissing(error: unknown) {
  return (error as NodeJS.ErrnoException)?.code === "ENOENT";
}

function isMusicFilename(filename: string) {
  return /\.wav$/i.test(filename) && !/[\\/:\x00-\x1f\x7f]/.test(filename);
}

/** Build the small JSON catalog; audio bytes are served directly from public/music. */
export async function listMusicTracks(): Promise<MusicTrack[]> {
  const directory = join(process.cwd(), "public", "music");
  try {
    const entry = await lstat(directory);
    if (!entry.isDirectory() || entry.isSymbolicLink()) return [];

    const entries = await readdir(directory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && isMusicFilename(entry.name))
      .map((entry) => ({
        filename: entry.name,
        title: entry.name.replace(/\.wav$/i, "").replace(/[-_]+/g, " ").trim() || entry.name,
        url: `/music/${encodeURIComponent(entry.name)}`,
      }))
      .sort((first, second) =>
        first.title.localeCompare(second.title, "en", { numeric: true, sensitivity: "base" }) ||
        first.filename.localeCompare(second.filename, "en"),
      );
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }
}
