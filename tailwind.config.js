/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  safelist: ['bg-blue-400','bg-green-400','bg-red-400'],
  theme: {
    fontFamily: {
      'sans': [
        "Montserrat",
        'ui-sans-serif',
        'system-ui',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
    },
    extend: {},
  },
  plugins: [],
}

