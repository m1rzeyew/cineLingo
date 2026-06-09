/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fef9f0',
          100: '#fdf0d9',
          200: '#fad9a8',
          300: '#f6be6e',
          400: '#f09d3a',
          500: '#d4873a',
          600: '#c07020',
          700: '#9a5818',
          800: '#7d4519',
          900: '#663919',
        },
        dark: {
          900: '#111111',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
          500: '#4a4a4a',
          400: '#6a6a6a',
        },
        cream: {
          50:  '#fdfcf9',
          100: '#f5f0e8',
          200: '#ede5d5',
          300: '#dfd2ba',
          400: '#cfc0a0',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)',
        'card-hover':'0 4px 24px rgba(0,0,0,0.10), 0 16px 48px rgba(0,0,0,0.08)',
        amber:      '0 4px 24px rgba(212,135,58,0.28)',
        'amber-lg': '0 8px 40px rgba(212,135,58,0.35)',
        dark:       '0 8px 32px rgba(0,0,0,0.24)',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out both',
        'slide-up':    'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'slide-right': 'slideRight 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'slide-left':  'slideLeft 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':    'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'float':       'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:     { from:{ opacity:0 },                                    to:{ opacity:1 } },
        slideUp:    { from:{ opacity:0, transform:'translateY(20px)' },      to:{ opacity:1, transform:'translateY(0)' } },
        slideRight: { from:{ opacity:0, transform:'translateX(100%)' },      to:{ opacity:1, transform:'translateX(0)' } },
        slideLeft:  { from:{ opacity:0, transform:'translateX(-100%)' },     to:{ opacity:1, transform:'translateX(0)' } },
        scaleIn:    { from:{ opacity:0, transform:'scale(0.95)' },           to:{ opacity:1, transform:'scale(1)' } },
        float:      { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}
