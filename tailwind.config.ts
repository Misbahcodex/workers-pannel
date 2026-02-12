import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.css",
  ],
  safelist: [
    { pattern: /^(bg|text|border|ring|ring-offset)-(surface|accent|status)-[\w-]+/ },
  ],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "#0f1419", card: "#1a2332", border: "#2d3a4f" },
        accent: { DEFAULT: "#3b82f6", muted: "#1e3a5f" },
        status: {
          pending: "#f59e0b",
          approved: "#22c55e",
          rejected: "#ef4444",
          on_duty: "#22c55e",
          off_duty: "#64748b",
          on_leave: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
