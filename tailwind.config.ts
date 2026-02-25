import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7b8cde",
        accent: "#c4a882",
        ember: "#d4764e",
        sorrow: "#5a6fa0",
        mist: "#8899bb",
        void: {
          950: "#050508",
          900: "#08080e",
          850: "#0b0b14",
          800: "#0e0e1a",
          700: "#141420",
          600: "#1a1a2c",
          500: "#222238",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "float-slow": "float-slow 8s ease-in-out infinite",
        "float-slower": "float-slower 12s ease-in-out infinite",
        "drift": "drift 20s linear infinite",
        "drift-reverse": "drift-reverse 25s linear infinite",
        "ember-rise": "ember-rise 6s ease-in infinite",
        "pulse-dim": "pulse-dim 4s ease-in-out infinite",
        "fog-move": "fog-move 30s ease-in-out infinite",
        "fog-move-reverse": "fog-move-reverse 35s ease-in-out infinite",
        "flicker": "flicker 3s ease-in-out infinite",
        "reveal-up": "reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(1deg)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(-0.5deg)" },
          "66%": { transform: "translateY(5px) rotate(0.5deg)" },
        },
        drift: {
          "0%": { transform: "translateX(-10%) translateY(0%)" },
          "50%": { transform: "translateX(10%) translateY(-5%)" },
          "100%": { transform: "translateX(-10%) translateY(0%)" },
        },
        "drift-reverse": {
          "0%": { transform: "translateX(10%) translateY(0%)" },
          "50%": { transform: "translateX(-10%) translateY(5%)" },
          "100%": { transform: "translateX(10%) translateY(0%)" },
        },
        "ember-rise": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
          "100%": { transform: "translateY(-100vh) scale(0)", opacity: "0" },
        },
        "pulse-dim": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        "fog-move": {
          "0%, 100%": { transform: "translateX(0%) translateY(0%)", opacity: "0.15" },
          "25%": { transform: "translateX(5%) translateY(-3%)", opacity: "0.2" },
          "50%": { transform: "translateX(-3%) translateY(2%)", opacity: "0.1" },
          "75%": { transform: "translateX(2%) translateY(-1%)", opacity: "0.18" },
        },
        "fog-move-reverse": {
          "0%, 100%": { transform: "translateX(0%) translateY(0%)", opacity: "0.1" },
          "25%": { transform: "translateX(-5%) translateY(3%)", opacity: "0.15" },
          "50%": { transform: "translateX(3%) translateY(-2%)", opacity: "0.08" },
          "75%": { transform: "translateX(-2%) translateY(1%)", opacity: "0.12" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "40%": { opacity: "0.85" },
          "42%": { opacity: "1" },
          "60%": { opacity: "0.9" },
          "62%": { opacity: "1" },
        },
        "reveal-up": {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
