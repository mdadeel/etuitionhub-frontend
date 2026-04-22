import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter Variable',
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif'
        ],
        mono: [
          'Geist Mono',
          'monospace'
        ]
      },
      colors: {
        // Core Shadcn variables using HSL
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // Apple Design System - Explicit Hex for stability
        'apple-gray': {
          50: '#FBFBFD',
          100: '#F5F5F7',
          200: '#E8E8ED',
          300: '#D2D2D7',
          400: '#A1A1A6',
          500: '#86868B',
          600: '#6E6E73',
          700: '#424245',
          800: '#1D1D1F',
          900: '#000000',
        },
        'apple-blue': {
          DEFAULT: '#0071E3',
          dark: '#007AFF',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'container': '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'apple-sm': '0 2px 4px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 12px 24px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [tailwindAnimate],
}
