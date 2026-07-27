/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.ts',
    './src/**/*.scss',
  ],
  theme: {
    extend: {
      colors: {
        'mec-green': '#10b981',
        'mec-yellow': '#f59e0b',
        'mec-red': '#ef4444',
        'mec-gray': '#6b7280',
        'mec-bg': '#111827',
        'mec-muted': '#9ca3af',
        'primary': '#0ea5e9',   // electric blue
        'secondary': '#06b6d4', // cyan
      },
    },
  },
  plugins: [],
};