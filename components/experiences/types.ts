export type Experience = {
  id: string;
  role: string;
  company: string;
  companyUrl: string;
  period: string;
  /** Short skill labels displayed as rounded tags below the role. */
  skills: string[];
  /** Optional city, region, or remote-work label. Blank values are hidden. */
  location?: string;
  logo: {
    src: string;
    /** Natural image dimensions. Keep these unchanged when adjusting display size. */
    width: number;
    height: number;
    /** Set one displayed dimension; the other follows the natural aspect ratio. */
    size?: { height: string; width?: never } | { width: string; height?: never };
    /** Monochrome logos inherit the text color; original preserves brand colors. */
    appearance?: "monochrome" | "original";
    /** Relative horizontal offset in em: positive moves right, negative left. */
    offsetX?: number;
    /** Relative vertical offset in em: positive moves down, negative up. */
    offsetY?: number;
  };
};
