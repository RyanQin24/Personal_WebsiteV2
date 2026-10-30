import {
  META_DESCRIPTION_HOME,
  META_TITLE_HOME,
  THEME_BACKGROUND,
} from "@/lib/constants";
import { MetadataRoute } from "next";

// Docs for this file: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest#generate-a-manifest-file
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${META_TITLE_HOME}'s Personal Website`,
    short_name: META_TITLE_HOME,
    description: META_DESCRIPTION_HOME,
    categories: [
      "personal",
      "entrepreneurship",
      "business",
      "finance",
      "games",
      "software",
      "lifestyle",
      "photo",
      "productivity",
      "social",
      "travel",
    ],
    start_url: "/",
    display: "browser", // Default.
    background_color: THEME_BACKGROUND,
    theme_color: THEME_BACKGROUND,
    lang: "en",
    icons: [
      {
        src: "/icon.png",
        sizes: "39x45",
        type: "image/png",
      },
    ],
  };
}
