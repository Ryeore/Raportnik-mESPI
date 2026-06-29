/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1E3F",
          light: "#13294B",
          dark: "#071528"
        },
        accent: "#22C55E"
      }
    }
  },
  plugins: []
};
