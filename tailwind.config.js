/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Every integer step, so modifiers like bg-ink/92 or border-white/12 actually emit CSS.
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, String(i / 100)])),
      colors: {
        ink: {
          DEFAULT: '#050505',
          800: '#0A0A0B',
          700: '#101012',
          600: '#17171A',
          500: '#202024',
        },
        gold: {
          DEFAULT: '#D9B86C',
          50: '#FBF4E4',
          100: '#F4E5C4',
          200: '#EBD5A2',
          300: '#E2C687',
          400: '#D9B86C',
          500: '#C6A055',
          600: '#A8874A',
          700: '#7C6335',
          800: '#4E3F22',
          900: '#2A210F',
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.28em',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.32, 0.72, 0, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      screens: {
        xs: '420px',
        '3xl': '1800px',
      },
    },
  },
  plugins: [],
}
