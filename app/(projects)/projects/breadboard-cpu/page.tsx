import readmeStyles from "@/components/projects/ProjectReadme.module.css";
import projectStyles from "@/components/projects/Projects.module.css";
import imageAssetMap from "@/content/projects/breadboard-cpu-assets.json";
import { BASE_URL, PATH_BREADBOARD_CPU, PATH_PROJECTS } from "@/lib/constants";
import markdownToHtml from "@/lib/posts/markdownToHtml";
import { getOGData } from "@/lib/utils";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";

const description = "A 4-bit CPU built from discrete logic gates: instruction set, clock and reset circuits, registers, ALU, control logic, and an assembly test program.";

export const metadata: Metadata = {
  title: "Breadboard CPU",
  description,
  alternates: { canonical: PATH_BREADBOARD_CPU },
  openGraph: getOGData({
    title: "Breadboard CPU",
    description,
    url: `${BASE_URL}${PATH_BREADBOARD_CPU}`,
    previewImage: {
      url: `${BASE_URL}/images/projects/BBCPU_Proj.jpg`,
      alt: "Breadboard CPU built from discrete logic gates.",
    },
  }),
};

export default async function BreadboardCpuPage() {
  const markdown = await readFile(
    path.join(process.cwd(), "content/projects/breadboard-cpu.md"),
    "utf8",
  );
  let html = await markdownToHtml(markdown);
  // Keep the original README unchanged while serving its bundled images locally.
  const imageAssets: Record<string, string> = imageAssetMap;
  for (const [source, local] of Object.entries(imageAssets)) {
    html = html.replaceAll(source, local);
  }

  return (
    <div className={projectStyles.page}>
      <div className={readmeStyles.readmePage}>
        <Link href={PATH_PROJECTS} className={readmeStyles.backLink}>← All projects</Link>
        <article className={readmeStyles.markdown} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
