/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      extend: {},
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive']
      }
    }
  },
  plugins: [require('flowbite/plugin')]
}
