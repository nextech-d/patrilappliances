// tailwind.config.cjs
/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}" // in case of src folder
  ],
  theme: {
    extend: {
      colors: {
        slate: colors.slate,
        amber: colors.amber,
        emerald: colors.emerald,
      },
    },
  },
  plugins: [],
};
