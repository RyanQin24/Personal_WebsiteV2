import Image from "next/image";
import type { CSSProperties } from "react";
import type { Experience } from "./types";
import styles from "./Experiences.module.css";

function CompanyLogo({ logo }: { logo: Experience["logo"] }) {
  const ratio = logo.width / logo.height;
  const displayHeight = logo.size?.height ?? "1em";
  const displayWidth = logo.size?.width;
  const logoStyle = {
    "--logo-width": displayWidth ?? `calc(${displayHeight} * ${ratio})`,
    "--logo-height": displayWidth ? `calc(${displayWidth} / ${ratio})` : displayHeight,
    "--logo-image": `url("${logo.src}")`,
  } as CSSProperties;

  if (logo.appearance === "original") {
    return (
      <Image
        className={styles.originalLogo}
        src={logo.src}
        width={logo.width}
        height={logo.height}
        style={logoStyle}
        alt=""
        unoptimized
      />
    );
  }

  return <span className={styles.monochromeLogo} style={logoStyle} aria-hidden="true" />;
}

export default function ExperienceList({ experiences }: { experiences: Experience[] }) {
  return (
    <ol className={styles.list}>
      {experiences.map((experience) => {
        const location = experience.location?.trim();
        const skills = experience.skills.map((skill) => skill.trim()).filter(Boolean);

        return (
          <li key={experience.id} className={styles.entry}>
            <p className={styles.period}>{experience.period}</p>
            <div className={styles.details}>
              <h2 className={styles.title}>
                {experience.role}{" "}
                <span className={styles.affiliation}>
                  @{" "}
                  <a
                    className={styles.companyLink}
                    style={{
                      "--logo-offset-x": `${experience.logo.offsetX ?? 0}em`,
                      "--logo-offset-y": `${experience.logo.offsetY ?? 0}em`,
                    } as CSSProperties}
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${experience.company} website (opens in a new tab)`}
                    title={experience.company}
                  >
                    <CompanyLogo logo={experience.logo} />
                  </a>
                </span>
              </h2>
              {skills.length > 0 && (
                <ul className={styles.skills} aria-label={`${experience.company} skills`}>
                  {skills.map((skill, index) => (
                    <li key={`${skill}-${index}`} className={styles.skill}>{skill}</li>
                  ))}
                </ul>
              )}
              {location && <p className={styles.location}>{location}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
