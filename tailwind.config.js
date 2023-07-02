/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        // sans: ["var(--font-sans)"],
        // mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
