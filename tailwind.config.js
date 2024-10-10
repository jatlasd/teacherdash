/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FCFAEE",
        primary: {
          DEFAULT: "#4836A1",
          50: "#DAD6F1",
          100: "#CDC6EC",
          200: "#B1A8E2",
          300: "#9689D7",
          400: "#7B6BCD",
          500: "#604CC3",
          600: "#4836A1",
          700: "#352877",
          800: "#221A4D",
          900: "#100C23",
          950: "#06050E",
        },
        secondary: {
          DEFAULT: "#EB5160",
          50: "#FEF6F6",
          100: "#FCE3E6",
          200: "#F8BFC4",
          300: "#F39AA3",
          400: "#EF7681",
          500: "#EB5160",
          600: "#E51F32",
          700: "#B71525",
          800: "#840F1B",
          900: "#520911",
          950: "#39070B",
        },
        light: "#DBE4EE",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
