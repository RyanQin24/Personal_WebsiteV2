export type ProjectLink = {
  /** Visible link text, e.g. "GitHub" or "Video". */
  label: string;
  /** Complete HTTP(S) URL or a site path beginning with /. */
  href: string;
};

export type Project = {
  /** Unique row identifier: lowercase letters, numbers, and hyphens. */
  slug: string;
  /** Full heading, including any hackathon name and award. */
  title: string;
  /** Optional real detail-page URL. When provided, the title links to that page. */
  detailsHref?: string;
  /** Optional labelled links below the skills, in display order. */
  links?: ProjectLink[];
  summary: string;
  image: {
    /** Public URL, e.g. /images/projects/my-project.webp. */
    src: string;
    alt: string;
    /** Cover fills the window without stretching; contain shows the whole image. Default: cover. */
    fit?: "cover" | "contain";
    /** CSS object-position, e.g. "center" or "50% 25%". */
    position?: string;
    /** Optional frame ratio, e.g. "16 / 9" or "4 / 3". */
    aspectRatio?: string;
  };
  technologies: string[];
};
