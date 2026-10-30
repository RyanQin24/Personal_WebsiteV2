import { listMusicTracks } from "@/lib/audio/musicCatalog";

export const runtime = "nodejs";
// Next.js emits the catalog as static JSON during each production build.
// In development, route handlers still run on each request to reflect folder edits.
export const dynamic = "force-static";

export async function GET() {
  return Response.json({ tracks: await listMusicTracks() });
}
