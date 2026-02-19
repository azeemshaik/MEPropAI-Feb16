/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f7ff',
          400: '#38bdf8',
          500: '#006aff', // Zillow Blue
          600: '#0055cc',
          700: '#0044aa',
        },
        apple: {
          gray: '#f5f5f7',
          text: '#1d1d1f',
          secondary: '#86868b'
        }
      },
      borderRadius: {
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
