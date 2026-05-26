/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        church: {
          950: '#040f0e',
          900: '#0a2d28',
          800: '#0f3d37',
          700: '#155049',
          600: '#1c6659',
          500: '#237d6c',
        },
        gold: {
          100: '#fdf8e8',
          200: '#faefc0',
          300: '#f5e098',
          400: '#e8c84a',
          500: '#c9a227',
          600: '#a07c1e',
          700: '#7a5c14',
          800: '#53400d',
        },
        crimson: {
          DEFAULT: '#cc2929',
          dark: '#991f1f',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e8c84a 0%, #c9a227 60%, #a07c1e 100%)',
        'church-gradient': 'linear-gradient(160deg, #040f0e 0%, #0a2d28 50%, #155049 100%)',
        'card-gradient': 'linear-gradient(160deg, #0f3d37 0%, #0a2d28 100%)',
      },
      boxShadow: {
        gold: '0 4px 24px rgba(201,162,39,0.35)',
        'gold-sm': '0 2px 12px rgba(201,162,39,0.2)',
        'gold-lg': '0 8px 40px rgba(201,162,39,0.45)',
        church: '0 8px 32px rgba(4,15,14,0.6)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,162,39,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(201,162,39,0)' },
        },
      },
    },
  },
  plugins: [],
}
