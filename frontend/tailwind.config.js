/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#020408',
          secondary: '#060c12',
          tertiary: '#0a1220',
        },
        surface: {
          DEFAULT: '#0d1a2a',
          2: '#102030',
        },
        border: {
          DEFAULT: '#1a2d45',
          2: '#1e3555',
        },
        accent: {
          DEFAULT: '#00d4ff',
          2: '#0088ff',
          3: '#ff6b35',
        },
        brand: {
          green: '#00ff9d',
          purple: '#9d4eff',
        },
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #00d4ff, #0088ff)',
        'grad-purple': 'linear-gradient(135deg, #9d4eff, #0088ff)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'typing': 'typing 0.1s steps(1) infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 20px rgba(0,212,255,0.2)' }, '50%': { boxShadow: '0 0 40px rgba(0,212,255,0.5)' } },
      },
    },
  },
  plugins: [],
};
