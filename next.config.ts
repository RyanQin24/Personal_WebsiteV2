import { NextConfig } from "next";
import {
  PATH_DSP,
  PATH_LEO_AND_CATE,
  PATH_PROJECTS,
  PATH_BREADBOARD_CPU,
  PATH_WRITING,
  PATH_WRITING_DEPRECATED,
} from "./lib/constants";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    [PATH_BREADBOARD_CPU]: ["./content/projects/breadboard-cpu.md"],
  },
  outputFileTracingExcludes: {
    // The music catalog is generated at build time; WAVs are served as static assets.
    "/*": ["./public/music/**/*"],
  },
  async redirects() {
    return [
      { source: "/games", destination: PATH_PROJECTS, permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/posts", destination: "/writing", permanent: true },
      { source: "/raytracing", destination: PATH_LEO_AND_CATE, permanent: true },
      { source: "/photography", destination: PATH_DSP, permanent: true },
    ];
  },

  async rewrites() {
    return [
      { source: "/feed.xml(.*)", destination: "/feed.xml" },
      {
        source: "/images/:path*",
        destination: "/images/:path*",
      },
      {
        source: "/icons/:path*",
        destination: "/icons/:path*",
      },
      {
        source: "/cv/:path*",
        destination: "/cv/:path*",
      },
      {
        source: PATH_WRITING_DEPRECATED,
        destination: PATH_WRITING,
      },
    ];
  },
};

export default nextConfig;
