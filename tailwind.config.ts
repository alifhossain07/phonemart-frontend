import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkgray: "#1B1B1B",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      // 👇 Added this part
      keyframes: {
        pulseScaleColor: {
          "0%, 100%": { transform: "scale(1)", color: "#000000" }, // small & black
          "50%": { transform: "scale(1.25)", color: "#ffffff" },   // larger & white
        },
      },
      animation: {
        pulseScaleColor: "pulseScaleColor 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
