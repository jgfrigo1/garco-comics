/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spidey: {
          red: '#e62429',
          blue: '#0d47a1',
          darkBlue: '#0a3882',
          black: '#1a1a1a',
          yellow: '#ffd700',
        }
      },
      fontFamily: {
        comic: ['Bangers', 'cursive'],
      },
      keyframes: {
        "bounce-in": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "80%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "bounce-in": "bounce-in 0.4s ease-out forwards",
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
