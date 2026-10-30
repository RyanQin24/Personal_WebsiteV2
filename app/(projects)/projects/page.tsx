import ProjectCard from "@/components/projects/ProjectCard";
import styles from "@/components/projects/Projects.module.css";
import { BASE_URL, META_DESCRIPTION_PROJECTS, PATH_PROJECTS } from "@/lib/constants";
import { getOGData } from "@/lib/utils";
import type { Metadata } from "next";
import { projects } from "./content";

export const metadata: Metadata = {
  title: "Projects",
  description: META_DESCRIPTION_PROJECTS,
  alternates: { canonical: PATH_PROJECTS },
  openGraph: getOGData({
    title: "Selected Projects",
    description: META_DESCRIPTION_PROJECTS,
    url: `${BASE_URL}${PATH_PROJECTS}`,
  }),
};

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Selected Projects</h1>
      <div className={styles.list} aria-label="Projects">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} priority={index === 0} />
        ))}
      </div>
    </div>
  );
}
