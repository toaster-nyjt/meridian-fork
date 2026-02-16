import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/meridian/**/*.{js,jsx,ts,tsx}",
    "../../**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        merit: {
          100: "#E1FFED",
          200: "#C8FDDD",
          300: "#B3F0CB",
          400: "#87D4A6",
          500: "#6BB789",
          600: "#488B63",
          700: "#316746",
        },
        meridian: {
          100: "#EDFBF2",
          200: "#D7F2E1",
          300: "#B7D8C4",
          400: "#88AA95",
          500: "#628670",
          600: "#486754",
          700: "#314D3B",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;