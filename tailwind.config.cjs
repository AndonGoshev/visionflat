/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#18181b', // dark gray
          foreground: '#f4f4f5',
        },
        background: {
          DEFAULT: '#09090b', // almost black
          foreground: '#f4f4f5',
        },
        accent: {
          DEFAULT: '#fb923c', // orange-400
          dark: '#ea580c',    // orange-700
        },
      },
    },
  },
  plugins: [],
} 