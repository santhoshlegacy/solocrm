import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#080808",
          canvas: "#080808",
          surface: "#0e0e11",
          elevated: "#141418",
          border: "rgba(255, 255, 255, 0.07)",
        },
        charcoal: {
          DEFAULT: "#080808",
          canvas: "#080808",
          surface: "#0e0e11",
          elevated: "#141418",
          border: "rgba(255, 255, 255, 0.07)",
        },
        crimson: {
          DEFAULT: "#d41514",
          400: "#e03837",
          500: "#d41514",
          600: "#b5100f",
        },
        chrome: {
          DEFAULT: "#d4d4d8",
          100: "#fafafa",
          200: "#f4f4f5",
          300: "#e4e4e7",
          400: "#d4d4d8",
          500: "#a1a1aa",
          600: "#71717a",
          700: "#52525b",
          800: "#3f3f46",
          900: "#27272a",
        },
        emerald: {
          DEFAULT: "#d41514",
          300: "#e55d5c",
          400: "#e03837",
          500: "#d41514",
          600: "#b5100f",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "'Inter'", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        none: "none",
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        luxury: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 4px 20px -2px rgba(0, 0, 0, 0.7)",
        "luxury-elevated": "inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 8px 30px -4px rgba(0, 0, 0, 0.85)",
      },
    },
  },
  plugins: [],
};

export default config;
