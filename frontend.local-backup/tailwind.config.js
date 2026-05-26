/** @type {import('tailwindcss').Config} */
const rgb = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: rgb('ink'),
          800: rgb('ink-800'),
          700: rgb('ink-700'),
          600: rgb('ink-600'),
        },
        bone: {
          DEFAULT: rgb('bone'),
          dim: rgb('bone-dim'),
          dark: rgb('bone-dark'),
        },
        amber: {
          DEFAULT: rgb('amber'),
          light: rgb('amber-light'),
          glow: rgb('amber-glow'),
          dark: rgb('amber-dark'),
        },
        forest: rgb('forest'),
        rust: rgb('rust'),
      },
      fontFamily: {
        /* Display + stencil = Bebas Neue (industrial label aesthetic) */
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        stencil: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        /* Wordmark = Sora (geometric brand) */
        brand: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        /* Body = Carlito (Calibri-metric-compatible — matches brand guide doc) */
        sans: ['Carlito', 'Calibri', 'Inter', 'system-ui', 'sans-serif'],
        /* Editorial accent (used sparingly for long quotes) */
        editorial: ['Fraunces', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        'pulse-glow': 'pulseGlow 3.5s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
        'gradient-x': 'gradientX 8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(0.6deg)' },
        },
        shimmer: {
          '0%,100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(200,146,61,0.0), 0 10px 40px -10px rgba(200,146,61,0.5)' },
          '50%': { boxShadow: '0 0 0 8px rgba(200,146,61,0.08), 0 14px 50px -10px rgba(200,146,61,0.7)' },
        },
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
