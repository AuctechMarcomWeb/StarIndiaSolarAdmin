/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust for CRA
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
