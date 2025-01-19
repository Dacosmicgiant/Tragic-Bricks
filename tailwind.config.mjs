/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d1dbe6',
          300: '#a9bcd1',
          400: '#7a97b9',
          500: '#5a7ba3',
          600: '#476288',
          700: '#3b4f6f',
          800: '#334460',
          900: '#2d3a51',
          950: '#1a2231',
        },
        accent: {
          teal: '#4fd1c5',
          rust: '#c53030',
          silver: '#cbd5e0',
        },
        haunted: {
          dark: '#1a1a1a',
          light: '#2d2d2d',
          accent: '#4a4a4a',
        },
      },
      fontFamily: {
        sans: ['var(--font-lato)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--font-playfair)', ...defaultTheme.fontFamily.serif],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-down': 'fadeDown 0.5s ease-out forwards',
        'ghost-float': 'ghostFloat 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ghostFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
