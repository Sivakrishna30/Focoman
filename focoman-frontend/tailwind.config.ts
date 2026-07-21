import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: {
            primary: "#F97316",
            light: "#FB923C",
            soft: "#FED7AA",
            background: "#FFF7ED",
          },
          blue: {
            primary: "#0EA5E9",
            light: "#38BDF8",
            soft: "#BAE6FD",
            background: "#F0F9FF",
          },
          purple: {
            primary: "#8B5CF6",
            light: "#A78BFA",
            soft: "#DDD6FE",
            background: "#FAF5FF",
          },
        },
        surface: {
          app: "#FAFAFA",
          card: "#FFFFFF",
        },
        border: {
          default: "#E5E7EB",
          divider: "#F3F4F6",
        },
        text: {
          primary: "#111827",
          secondary: "#4B5563",
          tertiary: "#9CA3AF",
          disabled: "#D1D5DB",
        },
        status: {
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
