import type { Config } from "tailwindcss";



export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Main actions, links, buttons
          hover: '#2563EB',
          active: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#64748B', // Secondary buttons, neutral interactions
          hover: '#475569',
          active: '#334155',
        },
        success: '#22C55E', // Positive feedback
        warning: '#F59E0B', // Warnings, alerts
        danger: '#EF4444',  // Error states, destructive actions
        background: {
          DEFAULT: '#F9FAFB', // Page background
          muted: '#F3F4F6',  // Secondary background, cards
        },
        foreground: {
          DEFAULT: '#111827', // Primary text
          muted: '#6B7280',   // Secondary text, placeholders
        },
        border: '#E5E7EB',     // Dividers, borders
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
