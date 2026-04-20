import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans: ['var(--font-instrument-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'Menlo', 'monospace'],
      },
      maxWidth: {
        reading: '720px',
        site: '1200px',
      },
      colors: {
        paper: '#f4efe6',
        ink: '#1c1a15',
        mute: '#6c6559',
        rule: '#e0d8c9',
        accent: '#c05440',
        paperAlt: '#ebe3d2',
      },
      keyframes: {
        pxBob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        pxBlink: {
          '0%, 92%, 100%': { opacity: '1' },
          '95%': { opacity: '0.4' },
        },
      },
      animation: {
        pxBob: 'pxBob 2s ease-in-out infinite',
        pxBlink: 'pxBlink 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
