const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/changelog/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/changelog/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Rubik',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica',
          'Arial',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      colors: {
        primary: '#362d59',
        pruple: '#8d5494',
        red: '#e1567c',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
