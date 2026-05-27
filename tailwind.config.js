/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/demo-app/src/**/*.{html,ts}",
    "./projects/ui-lib/src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'portal-green': '#00b5cc',
        'portal-lime':  '#97ce4c',
        'space-dark':   '#0a0e1a',
        'space-mid':    '#1a1f35',
        'space-light':  '#2d3561',
        'rick-yellow':  '#f5c518',
        'rick-orange':  '#e85d04',
      },
      fontFamily: {
        display: ['"Exo 2"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
