/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0d0e15',
        cyan: { neon: '#00f0ff' },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
