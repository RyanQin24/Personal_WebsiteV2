"use client";

import {
  PATH_ABOUT,
  PATH_HOME,
  PATH_DSP,
  PATH_WRITING,
  PATH_PROJECTS,
} from "@/lib/constants";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../atoms/ThemeToggle";
import NavButton from "../common/links/NavButton";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation} aria-label="Main navigation">
      <NavButton
        href={PATH_HOME}
        active={pathname === PATH_HOME}
        aria-label="Home"
      >
        Home
      </NavButton>
      <NavButton
        href={PATH_ABOUT}
        active={pathname === PATH_ABOUT}
        aria-label="About"
      >
        Experiences
      </NavButton>
      <NavButton
        href={PATH_PROJECTS}
        active={pathname === PATH_PROJECTS || pathname.startsWith(`${PATH_PROJECTS}/`)}
        aria-label="Projects"
      >
        Projects
      </NavButton>
      <NavButton
        href={PATH_WRITING}
        active={pathname.includes(PATH_WRITING)}
        aria-label="Writing"
      >
        Writing
      </NavButton>
      <NavButton
        href={PATH_DSP}
        active={pathname === PATH_DSP}
        aria-label="DSP audio lab"
      >
        DSP!
      </NavButton>
      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>
    </nav>
  );
}
