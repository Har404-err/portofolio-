import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "cursive"],
        vt323: ['"VT323"', "monospace"],
      },
      colors: {
        mc: {
          diamond: '#4dedf4',
          obsidian: '#110b11',
          stone: '#7d7d7d',
          dirt: '#866043',
          grass: '#4d924c',
          wood: '#5d4037',
        }
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
    layout: {
      radius: {
        small: "0px",
        medium: "0px",
        large: "0px",
      },
      borderWidth: {
        small: "2px",
        medium: "4px",
        large: "6px",
      }
    },
    themes: {
      dark: {
        colors: {
          primary: {
            DEFAULT: "#4d924c", // Grass
            foreground: "#ffffff",
          },
          secondary: {
            DEFAULT: "#4dedf4", // Diamond
            foreground: "#000000",
          },
          background: "#110b11",
          content1: "#c6c6c6", // Stone light for cards
          content2: "#866043", // Dirt
        },
      },
    },
  })],
};
