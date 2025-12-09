/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marine: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#003366', // Primary Marine Blue
          700: '#00264d',
          800: '#001a33',
          900: '#000d1a',
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [require("flowbite/plugin")],
};
