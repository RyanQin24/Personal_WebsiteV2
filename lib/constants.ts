import { isProd } from "./utils";

export const BASE_URL = isProd()
  ? "https://ryanqin.com"
  : "http://localhost:3000";

export const PATH_HOME = "/";
export const PATH_ABOUT = "/about";
export const PATH_PROJECTS = "/projects";
export const PATH_BREADBOARD_CPU = "/projects/breadboard-cpu";
export const PATH_WRITING_DEPRECATED = "/posts";
export const PATH_WRITING = "/writing";
export const PATH_DSP = "/DSP";
export const PATH_LEO_AND_CATE = "/Leo&Cate";
export const PATH_RAYTRACING_IMAGES = "/images/raytracing";
export const PATH_CV = "/cv";
export const PATH_CV_STATIC = "/cv/Josiah_Plett_CV_2025.pdf";
export const PATH_MAZE = "/maze";
export const PATH_MAZE_IMAGES = "/images/home";

export const URL_MY_LINKEDIN = "https://www.linkedin.com/in/ryan-qin-ece/";
export const URL_MY_GITHUB = "https://github.com/RyanQin24";
export const MY_EMAIL_ADDRESS = "r25qin@uWaterloo.ca";
export const URL_MY_EMAIL = `mailto:${MY_EMAIL_ADDRESS}`;

export const COPYRIGHT_STRING = `© ${new Date().getFullYear()} Josiah Plett`;

export const VISITOR_EXPIRATION = 60 * 60 * 24; // Visits are considered unique again after 24 hours.
export const FALLBACK_TOTAL_VISITORS = 18836;

export const META_TITLE_HOME = "Ryan Qin";
export const META_DESCRIPTION_HOME =
  "My personal website, covering my professional interests, hobbies, games, writing, and photography.";
export const META_DESCRIPTION_DSP =
  "A browser-based WAV player with stereo analog VU meters, adjustable RC needle response, and a live VFD-style FFT spectrum analyzer.";
export const META_DESCRIPTION_PROJECTS =
  "Hardware, FPGA, robotics, and software projects by Ryan Qin.";
export const META_DESCRIPTION_EXPERIENCES =
  "Ryan Qin's experience in high-speed I/O, electrical engineering, rail systems, and solar-car hardware.";
export const META_DESCRIPTION_MAZE =
  "My 4-dimensional maze, an original design you can download and build yourself.";

export const THEME_BACKGROUND = "#0C0A09";
export const THEME_LIGHT_PRIMARY = "#1C1917";
export const THEME_DARK_PRIMARY = "#FAFAF9";
