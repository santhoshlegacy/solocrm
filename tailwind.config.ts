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
        fintech: {
          pink: "#E8B4F8",
          purple: "#B270A2",
          deep: "#7A5A97",
          silver: "#E2DCE7",
          muted: "#A098A8",
          dark: "#120B18",
          canvas: "#09050F",
        },
        obsidian: {
          DEFAULT: "#09050F",
          canvas: "#09050F",
          surface: "rgba(255, 255, 255, 0.04)",
          elevated: "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.10)",
        },
        charcoal: {
          DEFAULT: "#09050F",
          canvas: "#09050F",
          surface: "rgba(255, 255, 255, 0.04)",
          elevated: "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.10)",
        },
        crimson: {
          DEFAULT: "#E8B4F8",
          400: "#F0C8FA",
          500: "#E8B4F8",
          600: "#B270A2",
        },
        chrome: {
          DEFAULT: "#E2DCE7",
          100: "#FAF7FC",
          200: "#F2ECF6",
          300: "#E2DCE7",
          400: "#C4BDCB",
          500: "#A098A8",
          600: "#7A7382",
          700: "#595360",
          800: "#3B3642",
          900: "#24202A",
        },
        emerald: {
          DEFAULT: "#E8B4F8",
          300: "#F0C8FA",
          400: "#E8B4F8",
          500: "#B270A2",
          600: "#7A5A97",
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
