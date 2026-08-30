/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        darkMode: "class",
        navy: "#061D4D",
        "navy-light": "#0A2F70",
        orange: "#FF7A00",
        blue: "#1463E8",
        cyan: "#20A9F5",
      },

      boxShadow: {
        card: "0 10px 35px rgba(6, 29, 77, 0.10)",
        glow: "0 0 35px rgba(32, 169, 245, 0.25)",
      },
    },
  },

  plugins: [],
};