import type { Project } from "@/components/projects/types";
import { PATH_BREADBOARD_CPU } from "@/lib/constants";

// Edit, add, remove, or reorder project rows here. See docs/projects.md.
export const projects: Project[] = [
  {
    "slug": "takeone",
    "title": "TakeOne — Finalist at Hack the North 2026",
    "summary": "An AI-powered robotic film studio designed to turn a shot idea into real-world camera movement.",
    "image": {
      "src": "/images/projects/TakeOne_Proj.png",
      "alt": "TakeOne robotic camera system.",
      "fit": "cover",
      "position": "center"
    },
    "technologies": [
      "CAN Bus",
      "ESP32",
      "Python",
      "MuJoCo",
      "React"
    ],
    "links": [
      {
        "label": "DevPost",
        "href": "https://devpost.com/software/takeone-erqv3l"
      },
      {
        "label": "GitHub",
        "href": "https://github.com/RyanQin24/TakeOne"
      }
    ]
  },
  {
    "slug": "verilog-ai-processor",
    "title": "Verilog AI processor",
    "summary": "Developing a 64-bit RISC-V processor with a five-stage CPU pipeline and a custom TPU for matrix computations.",
    "image": {
      "src": "/images/projects/AIProcessor_Proj.png",
      "alt": "Verilog AI processor project preview.",
      "fit": "cover",
      "position": "center"
    },
    "technologies": [
      "FPGA",
      "Verilog",
      "SystemVerilog"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/RyanQin24/VerilogProcessor"
      }
    ]
  },
  {
    "slug": "breadboard-cpu",
    "title": "Breadboard CPU",
    "detailsHref": PATH_BREADBOARD_CPU,
    "summary": "A 4-bit CPU built from discrete logic gates, with jump instructions, to explore how a processor works.",
    "image": {
      "src": "/images/projects/BBCPU_Proj.jpg",
      "alt": "Discrete logic components and wiring in the breadboard CPU.",
      "fit": "cover",
      "position": "center"
    },
    "technologies": [
      "NMOS/PMOS"
    ],
    "links": [
      {
        "label": "Details",
        "href": PATH_BREADBOARD_CPU
      },
      {
        "label": "Github",
        "href": "https://github.com/RyanQin24/Breadboard-CPU"
      },
      {
        "label": "Youtube",
        "href": "https://www.youtube.com/watch?v=tHEkYlJnZf8"
      }
    ]
  },
  {
    "slug": "fpga-clock",
    "title": "FPGA Clock",
    "summary": "A 24-hour digital clock implemented on an FPGA, with a VGA-rendered display.",
    "image": {
      "src": "/images/projects/VGAClock_Proj.jpg",
      "alt": "FPGA clock project and its VGA display.",
      "fit": "cover",
      "position": "center"
    },
    "technologies": [
      "FPGA",
      "Verilog",
      "Vivado"
    ],
    "links": [
      {
        "label": "Github",
        "href": "https://github.com/RyanQin24/FPGA-Clock"
      }
    ]
  },
  {
    "slug": "autodump",
    "title": "AutoDump — 3rd Place Overall at MakeCU Hackathon",
    "summary": "An autonomous trash rover that finds a bin with OpenCV, empties itself, and returns using ArUco markers. A Raspberry Pi runs vision while Arduinos handle I/O.",
    "image": {
      "src": "/images/projects/MakeCU_Proj.jpg",
      "alt": "AutoDump autonomous self-emptying trash rover.",
      "fit": "cover",
      "position": "center"
    },
    "technologies": [
      "Arduino",
      "Raspberry Pi",
      "OpenCV",
      "Python",
      "C++",
      "UART"
    ],
    "links": [
      {
        "label": "DevPost",
        "href": "https://devpost.com/software/autodump-autonomous-self-emptying-trash-rover"
      },
      {
        "label": "Github",
        "href": "https://github.com/RyanQin24/MakeCU"
      }
    ]
  },
  {
    "slug": "competition-rc",
    "title": "Competition RC — Top Qualified Finalist at Formula Null Hackathon",
    "summary": "An RC car powered by airsoft motors and custom MOSFET/relay H-bridges, achieving a 17-second lap against a 25-second average.",
    "image": {
      "src": "/images/projects/Fnull_Proj.JPG",
      "alt": "Competition RC car with custom motor-control electronics.",
      "fit": "cover",
      "position": "center"
    },
    "technologies": [
      "Arduino",
      "MOSFETs",
      "C++"
    ],
    "links": [
      {
        "label": "Github",
        "href": "https://github.com/RyanQin24/FormulaNULL-MotorDrivers?tab=readme-ov-file"
      }
    ]
  },
  {
    "slug": "biotron",
    "title": "BioTron — Best Hardware Hacks at JamHacks 8",
    "summary": "An IP-based modular watering system with an AI-assisted Android app and plug-and-play sensor and pump modules.",
    "image": {
      "src": "/images/projects/BioTron_Proj.jpeg",
      "alt": "BioTron modular watering-system hardware.",
      "fit": "cover",
      "position": "center"
    },
    "technologies": [
      "TCP/IP",
      "Python",
      "Raspberry Pi",
      "Android Studio"
    ],
    "links": [
      {
        "label": "DoraHacks",
        "href": "https://dorahacks.io/build/13373/"
      },
      {
        "label": "Github",
        "href": "https://github.com/RyanQin24/WateringSystem-Software"
      }
    ]
  }
];
