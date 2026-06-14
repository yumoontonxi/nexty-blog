/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
  darkMode: "class", // allows toggling dark mode manually
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "\"SF Pro Display\"", "\"Helvetica Neue\"", "Arial", "sans-serif", ...defaultTheme.fontFamily.sans],
        mono: ["\"JetBrains Mono Variable\"", "ui-monospace", "SFMono-Regular", "Menlo", "monospace", ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        "hero-breathe": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
        "cursor-blink": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "hero-breathe": "hero-breathe 10s ease-in-out infinite",
        "cursor-blink": "cursor-blink 1s step-end infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
