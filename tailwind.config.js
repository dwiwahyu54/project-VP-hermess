/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // Voyage Portal mostly uses inline styles; keep preflight for NC UI
  corePlugins: {
    preflight: true,
  },
}
