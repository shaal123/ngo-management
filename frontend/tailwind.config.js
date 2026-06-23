/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#1d4ed8",
          700: "#1e3a8f",
          800: "#1e3a5f",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [],
}