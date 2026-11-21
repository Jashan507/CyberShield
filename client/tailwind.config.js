export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0f1e',
          800: '#0d1526',
          700: '#111c35',
          600: '#1a2847'
        },
        cyber: {
          blue: '#00d4ff',
          cyan: '#00f5d4',
          green: '#39ff14'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    }
  },
  plugins: []
}
