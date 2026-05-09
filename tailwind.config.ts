import type { Config } from "tailwindcss";

/**
 * Tailwind v4 — minimal config.
 * Design tokens (colors, radii, shadows) live in src/app/globals.css via @theme.
 * This file is only needed for explicit content paths and future plugins.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
};

export default config;
