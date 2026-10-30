import CateTerminal from "@/components/stories/CateTerminal";
import { getBookBySlug } from "@/lib/books/api";
import { BASE_URL, PATH_LEO_AND_CATE } from "@/lib/constants";
import { getOGData } from "@/lib/utils";
import { Metadata } from "next/types";

export function generateMetadata(): Metadata {
  const story = getBookBySlug("Leo&Cate");

  return {
    title: story.title,
    description: story.preview,
    keywords: story.tags,
    alternates: { canonical: PATH_LEO_AND_CATE },
    openGraph: getOGData({
      title: story.title,
      description: story.preview,
      url: `${BASE_URL}${PATH_LEO_AND_CATE}`,
    }),
  };
}

export default function LeoAndCate() {
  const story = getBookBySlug("Leo&Cate");

  return (
    <CateTerminal
      title={story.subtitle || story.title}
      output={story.content.trim()}
    />
  );
}
