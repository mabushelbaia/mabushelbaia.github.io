/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/src/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        ["shine-infinite"]: "shine-infinite 2s ease-in-out infinite",
      },
      keyframes: {
        ["shine-infinite"]: {
          "0%": {
            transform: "skew(-12deg) translateX(-100%)",
          },
          "100%": {
            transform: "skew(-12deg) translateX(100%)",
          },
        },
      },
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}

