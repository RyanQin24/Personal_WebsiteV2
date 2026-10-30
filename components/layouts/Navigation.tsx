"use client";

import {
  PATH_ABOUT,
  PATH_HOME,
  PATH_DSP,
  PATH_WRITING,
  PATH_PROJECTS,
} from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../atoms/ThemeToggle";
import NavButton from "../common/links/NavButton";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const navigationRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const links = [
    { href: PATH_HOME, label: "Home", active: pathname === PATH_HOME },
    { href: PATH_ABOUT, label: "Experiences", active: pathname === PATH_ABOUT },
    {
      href: PATH_PROJECTS,
      label: "Projects",
      active: pathname === PATH_PROJECTS || pathname.startsWith(`${PATH_PROJECTS}/`),
    },
    { href: PATH_WRITING, label: "Writing", active: pathname.includes(PATH_WRITING) },
    { href: PATH_DSP, label: "DSP!", active: pathname === PATH_DSP },
  ];

  useEffect(() => {
    if (!menuOpen) return;

    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navigationRef.current?.contains(event.target)) {
        closeMenu();
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 640px)");
    const closeOnDesktop = () => {
      if (desktop.matches) closeMenu();
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("popstate", closeMenu);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("popstate", closeMenu);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen, closeMenu]);

  return (
    <nav ref={navigationRef} className={styles.navigation} aria-label="Main navigation">
      <Button
        ref={toggleRef}
        type="button"
        variant="ghost"
        size="icon"
        className={styles.menuToggle}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d={menuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </Button>
      <div
        id={menuId}
        className={styles.links}
        data-open={menuOpen}
      >
        {links.map(({ href, label, active }) => (
          <NavButton key={href} href={href} active={active} onClick={closeMenu}>
            {label}
          </NavButton>
        ))}
      </div>
      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>
    </nav>
  );
}
