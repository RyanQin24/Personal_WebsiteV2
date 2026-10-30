import {
  BASE_URL,
  PATH_ABOUT,
  PATH_PROJECTS,
  PATH_BREADBOARD_CPU,
  PATH_CV,
  PATH_LEO_AND_CATE,
  PATH_MAZE,
  PATH_DSP,
  PATH_WRITING,
} from "@/lib/constants";
import { getAllPosts } from "@/lib/posts/api";
import { formatDateAbbr } from "@/lib/utils";
import { MetadataRoute } from "next";

/**
 * The sitemap tells web scrapers, like Google's, about the routes within our application.
 * Importantly, this includes:
 *   - their *relative* priority (putting them all at 1 makes crawlers unhappy), and
 *   - their update frequency.
 *
 * More information: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: "2025-06-05",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}${PATH_ABOUT}`,
      lastModified: "2025-06-05",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}${PATH_WRITING}`,
      lastModified: "2025-05-12",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}${PATH_PROJECTS}`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}${PATH_BREADBOARD_CPU}`,
      lastModified: "2026-10-29",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}${PATH_LEO_AND_CATE}`,
      lastModified: "2026-10-25",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}${PATH_DSP}`,
      lastModified: "2026-10-25",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}${PATH_CV}`,
      lastModified: "2025-06-03",
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}${PATH_MAZE}`,
      lastModified: "2024-11-28",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const blogs = getAllPosts();

  blogs.forEach((post) => {
    routes.push({
      url: `${BASE_URL}${PATH_WRITING}/${post.slug}`,
      lastModified: formatDateAbbr(new Date(post.date)),
      changeFrequency: "yearly",
      priority: 0.2,
    });
  });

  return routes;
}
