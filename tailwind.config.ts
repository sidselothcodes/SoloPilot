/**
 * Tailwind config — defines the Collective design tokens
 * (pastel red accent palette, neutral text, soft borders) and
 * registers the Open Sans font variable injected by next/font.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#ffffff",
        panel: "#fafafa",
        border: "#f0e0e0",
        accent: "#e85d5d",
        accentHover: "#d44f4f",
        accentLight: "#fdf0f0",
        accentBorder: "#f5c0c0",
        textPrimary: "#1a1a1a",
        textSecondary: "#6b7280",
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.04)",
      },
      keyframes: {
        softPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        softPulse: "softPulse 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
