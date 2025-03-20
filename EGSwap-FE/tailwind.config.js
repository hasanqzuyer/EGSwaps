/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/App.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/views/**/*.{js,ts,jsx,tsx}',
    '../../packages/uikit/src/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {
    extend: {
      colors: {
        whiteAlpha: {
          50: '#FFFFFF0A',
          100: '#FFFFFF0F',
          200: '#FFFFFF14',
          300: '#FFFFFF29',
          400: '#FFFFFF3D',
        },
        primary: '#D40C0C',
      },
    },
    screens: {},
  },
  plugins: [],
}
