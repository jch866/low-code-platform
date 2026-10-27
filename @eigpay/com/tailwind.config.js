/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
    // './package/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: {
          fontSize: theme('fontSize.2xl'),
          fontWeight: theme('fontWeight.bold')
        },
        h2: {
          fontSize: theme('fontSize.xl'),
          fontWeight: theme('fontWeight.bold')
        },
        h3: {
          fontSize: theme('fontSize.lg'),
          fontWeight: theme('fontWeight.bold')
        }
      })
    })
  ]
}
