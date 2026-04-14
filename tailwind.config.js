import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        etuition: {
          "primary": "#0d9488",      // teal-600
          "secondary": "#7c3aed",    // violet-600  
          "accent": "#f59e0b",       // amber-500
          "neutral": "#374151",      // gray-700
          "base-100": "#ffffff",     // white
          "base-200": "#f3f4f6",     // gray-100
          "base-300": "#e5e7eb",     // gray-200
          "info": "#06b6d4",         // cyan-500
          "success": "#10b981",      // emerald-500
          "warning": "#f97316",      // orange-500
          "error": "#ef4444",        // red-500
        },
      },
    ],
  },
}
