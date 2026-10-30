import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import ProjectLinks from "./ProjectLinks";
import type { Project } from "./types";
import styles from "./Projects.module.css";

function ProjectImage({
  image,
  priority = false,
}: {
  image: Project["image"];
  priority?: boolean;
}) {
  return (
    <div
      className={styles.imageFrame}
      style={image.aspectRatio ? { "--project-image-ratio": image.aspectRatio } as CSSProperties : undefined}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 767px) calc(100vw - 128px), (max-width: 1099px) 34vw, 320px"
        priority={priority}
        style={{ objectFit: image.fit ?? "cover", objectPosition: image.position ?? "center" }}
      />
    </div>
  );
}

function ProjectTechnologies({ technologies }: { technologies: string[] }) {
  const skills = technologies.map((technology) => technology.trim()).filter(Boolean);
  if (skills.length === 0) return null;
  return (
    <ul className={styles.tags} aria-label="Technologies">
      {skills.map((technology, index) => (
        <li key={`${technology}-${index}`} className={styles.tag}>{technology}</li>
      ))}
    </ul>
  );
}

export default function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className={styles.card} aria-labelledby={`project-${project.slug}`}>
      <ProjectImage image={project.image} priority={priority} />
      <div className={styles.cardBody}>
        <h2 id={`project-${project.slug}`} className={styles.cardTitle}>
          {project.detailsHref ? (
            <Link href={project.detailsHref} className={styles.titleLink}>{project.title}</Link>
          ) : project.title}
        </h2>
        <p className={styles.summary}>{project.summary}</p>
        <div className={styles.cardFooter}>
          <ProjectTechnologies technologies={project.technologies} />
          <ProjectLinks links={project.links} projectTitle={project.title} />
        </div>
      </div>
    </article>
  );
}
