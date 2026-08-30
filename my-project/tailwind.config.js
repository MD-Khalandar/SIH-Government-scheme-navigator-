/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Obsidian Black
        "brand-dark": "#0D130E",
        "brand-surface": "#161F18",
        
        // Light & Mint Greens (Trust, growth, safety)
        "brand-green": {
          50: "#F2FBF5",
          100: "#E2F7E9",
          200: "#C4EED3",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          900: "#14532D",
        },
        
        // Amber Yellow (Caution, attention, official seals)
        "brand-yellow": {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          dark: "#D97706",
        },

        "brand-bg": "#F7FCF8",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
