import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
        },
        danger: {
          50: 'rgb(var(--danger-50) / <alpha-value>)',
          100: 'rgb(var(--danger-100) / <alpha-value>)',
          200: 'rgb(var(--danger-200) / <alpha-value>)',
          300: 'rgb(var(--danger-300) / <alpha-value>)',
          400: 'rgb(var(--danger-400) / <alpha-value>)',
          500: 'rgb(var(--danger-500) / <alpha-value>)',
          600: 'rgb(var(--danger-600) / <alpha-value>)',
          700: 'rgb(var(--danger-700) / <alpha-value>)',
          800: 'rgb(var(--danger-800) / <alpha-value>)',
          900: 'rgb(var(--danger-900) / <alpha-value>)',
        },
        success: {
          50: 'rgb(var(--success-50) / <alpha-value>)',
          100: 'rgb(var(--success-100) / <alpha-value>)',
          200: 'rgb(var(--success-200) / <alpha-value>)',
          300: 'rgb(var(--success-300) / <alpha-value>)',
          400: 'rgb(var(--success-400) / <alpha-value>)',
          500: 'rgb(var(--success-500) / <alpha-value>)',
          600: 'rgb(var(--success-600) / <alpha-value>)',
          700: 'rgb(var(--success-700) / <alpha-value>)',
          800: 'rgb(var(--success-800) / <alpha-value>)',
          900: 'rgb(var(--success-900) / <alpha-value>)',
        },
      },
      animation: {
        'in': 'animateIn 0.3s ease-in-out',
        'out': 'animateOut 0.3s ease-in-out',
      },
      keyframes: {
        animateIn: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        animateOut: {
          from: {
            opacity: '1',
            transform: 'translateY(0)',
          },
          to: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config