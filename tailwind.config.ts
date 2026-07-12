import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/modules/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        surface: "#1E293B",
        primary: "#2563EB",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        text: "#F8FAFC",
        muted: "#94A3B8",
        border: "#334155"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      borderRadius: {
        card: "0.5rem"
      },
      boxShadow: {
        panel: "0 18px 48px rgba(15, 23, 42, 0.22)"
      }
    }
  },
  plugins: [animate]
};

export default config;
