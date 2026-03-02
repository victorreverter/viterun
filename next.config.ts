import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

export default {
  output: "export",
  basePath: "/viterun",
  images: {
    unoptimized: true,
  },
} satisfies NextConfig;
