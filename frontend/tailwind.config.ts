import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ...defaultTheme,
    extend: {
      colors: {
        background: "#032539",
        white: "#ffffff",
        logo: "#07c1ff",
        lightgrey: "#d4d4d8",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;