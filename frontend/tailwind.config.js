/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cream: {
          50:  '#fdfaf5',
          100: '#faf4e8',
          200: '#f4e8d0',
          300: '#ecd7b0',
        },
        amber: {
          warm: '#d97706',
        },
        ink: {
          DEFAULT: '#1c1917',
          light: '#44403c',
          muted: '#78716c',
        },
        teal: {
          soft: '#0d9488',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'pop':     'pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'sparkle': 'sparkle 0.6s ease both',
        'pulse-warm': 'pulseWarm 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pop: {
          '0%':   { opacity: 0, transform: 'scale(0.85)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        sparkle: {
          '0%':   { opacity: 0, transform: 'scale(0) rotate(-10deg)' },
          '60%':  { opacity: 1, transform: 'scale(1.15) rotate(5deg)' },
          '100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
        },
        pulseWarm: {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0.6 },
        },
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
