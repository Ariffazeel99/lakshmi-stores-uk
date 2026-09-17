/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#0b5345',
          900: '#064e3b',
          deep: '#07392c',
        },
        gold: {
          50: '#fffbe6',
          100: '#fff3b3',
          200: '#ffe880',
          300: '#ffd94d',
          400: '#ffcb1a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f9f6ef',
          200: '#f3ece0',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'emerald-glow': '0 4px 20px -2px rgba(11, 83, 69, 0.15)',
        'gold-glow': '0 4px 20px -2px rgba(217, 119, 6, 0.25)',
        'card-hover': '0 12px 28px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'bounce-short': 'bounceShort 0.5s ease-in-out 1',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}

