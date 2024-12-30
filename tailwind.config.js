
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./scripts/**/*.js",
    "./**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        jetbrains: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'primary-blue': '#89BDFF', // Optional: Keep for accent purposes
        'secondary-gray': '#A9B7C6', // Example custom gray
        'custom-gray': '#3C3F41', // Example custom gray
      },
    },
  },
  plugins: [],
};

