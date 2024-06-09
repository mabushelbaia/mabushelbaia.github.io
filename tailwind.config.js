/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "*.html",
    "./templates/**/*.html",
    "./static/src/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'sans-serif'],
    },
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
      },

    },
  },
  plugins: [],
}

