/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./content/**/*.{js,jsx,ts,tsx,mdx}",
    "../src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/container-queries"),
  ],
};

