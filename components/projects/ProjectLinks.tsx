import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import type { ProjectLink } from "./types";
import styles from "./Projects.module.css";

function destination(href: string) {
  const value = href.trim();
  if (/[\u0000-\u001f\u007f]/.test(value)) return null;
  // Relative links stay within this website. Reject protocol-relative URLs.
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) {
    return { href: value, external: false };
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return { href: url.href, external: true };
  } catch {
    return null;
  }
}

export default function ProjectLinks({ links, projectTitle }: { links?: ProjectLink[]; projectTitle: string }) {
  const visibleLinks = (links ?? []).flatMap((link) => {
    const target = destination(link.href);
    const label = link.label.trim();
    return target && label ? [{ ...target, label }] : [];
  });
  if (visibleLinks.length === 0) return null;

  return (
    <ul className={styles.projectLinks} aria-label={`${projectTitle} links`}>
      {visibleLinks.map((link, index) => (
        <li key={`${link.href}-${index}`}>
          <Link
            href={link.href}
            className={styles.resourceLink}
            title={link.label}
            aria-label={`${link.label} — ${projectTitle}${link.external ? " (opens in a new tab)" : ""}`}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <span>{link.label}</span>
            <ExternalLinkIcon className={styles.linkArrow} aria-hidden="true" focusable="false" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
