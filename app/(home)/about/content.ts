import type { Experience } from "@/components/experiences/types";

// Roles and dates referenced from https://www.ryanqin.com/experiences.html.
// Replace the skill placeholders below with your own labels. See docs/experiences.md.
export const experiences: Experience[] = [
  {
    id: "amd",
    role: "HSIO Compliance Engineer",
    company: "AMD",
    companyUrl: "https://www.amd.com/en.html",
    period: "May 2026 – Present",
    skills: ["MI Instinct", "Tewnsorflow", "FPGA", "Verilog", "C++"],
    location: "Markham, ON", // The location appears below the skill tags.
    logo: {
      src: "/images/companies/amd-reference.png",
      width: 406,
      height: 119,
      size: { height: "1.0em" },
      appearance: "original",
      offsetX: 0.3,
      offsetY: 0.26,
    },
  },
  {
    id: "ats",
    role: "Electrical Engineering",
    company: "ATS",
    companyUrl: "https://atsautomation.com/",
    period: "Sep 2025 – Dec 2025",
    skills: ["TensorFlow", "Altium", "RTOS", "C++", "TCP/IP"],
    location: "Cambridge, ON",
    logo: {
      src: "/images/companies/ats-reference.jpg",
      width: 389,
      height: 98,
      size: { height: "1.0em" },
      appearance: "original",
      offsetX: 0.3,
      offsetY: 0.28,
    },
  },
  {
    id: "wsp",
    role: "Electrical Coordinator",
    company: "WSP",
    companyUrl: "https://www.wsp.com/en-gl",
    period: "Jan 2025 – May 2025",
    skills: ["cuDF", "MATLAB","C#", ".NET", "MYSQL"],
    location: "Markham, ON",
    logo: {
      src: "/images/companies/wsp-reference.png",
      width: 1781,
      height: 848,
      size: { height: "1.0em" },
      appearance: "original",
      offsetX: 0.3,
      offsetY: 0.35,
    },
  },
  {
    id: "midnight-sun",
    role: "Hardware Developer",
    company: "Midnight Sun",
    companyUrl: "https://www.uwmidsun.com/",
    period: "Sep 2024 – Jan 2025",
    skills: ["CAN", "RTOS", "STM32", "C++", "OpenCV"],
    location: "Waterloo, ON",
    logo: {
      src: "/images/companies/midnight-sun.png",
      width: 1500,
      height: 337,
      size: { height: "1.55em" },
      appearance: "original",
      offsetX: 0.3,
      offsetY: 0.50,
    },
  },
];
