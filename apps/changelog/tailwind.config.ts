const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.35s ease-in-out',
        'fade-in-left': 'fadeInLeft 0.55s ease-in-out',
        'fade-in-right': 'fadeInRight 0.55s ease-in-out',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow-6)',
      },
      keyframes: () => ({
        fadeIn: {
          '0%': {opacity: 0},
          '100%': {opacity: 1},
        },
        fadeInLeft: {
          '0%': {opacity: 0, transform: 'translateX(-20px)'},
          '100%': {opacity: 1, transform: 'translateX(0)'},
        },
        fadeInRight: {
          '0%': {opacity: 0, transform: 'translateX(20px)'},
          '100%': {opacity: 1, transform: 'translateX(0)'},
        },
      }),
      fontFamily: {
        sans: [
          'var(--font-rubik)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica',
          'Arial',
          ...defaultTheme.fontFamily.sans,
        ],
        mono: [
          'Roboto Mono',
          'SFMono-Regular',
          'Consolas',
          'Liberation Mono',
          'Menlo',
          'Courier',
          'monospace',
        ],
      },
      colors: {
        primary: '#362d59',
        pruple: '#8d5494',
        darkPurple: '#1F1633',
        'accent-purple': '#6A5FC1',
        'accent-md-violet': '#584774',
        red: '#e1567c',
        gold: '#F1B71C',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
  blocklist: ['collapse'],
};
