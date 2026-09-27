/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF9F5',
          card: '#FFFFFF',
          subtle: '#F4F6F0',
        },
        brand: {
          50: '#F3F8F1',
          100: '#E5EFE2',
          200: '#CBE0C7',
          500: '#4A7C59',
          600: '#2D5A27',
          700: '#21431D',
          800: '#173114',
          900: '#10220E',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(33, 67, 29, 0.05), 0 2px 6px -1px rgba(33, 67, 29, 0.03)',
        'card': '0 8px 30px -4px rgba(45, 90, 39, 0.07)',
      }
    },
  },
  plugins: [],
}
