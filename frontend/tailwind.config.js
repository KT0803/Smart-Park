/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Toggle dark mode by adding/removing the 'dark' class on <html>
  darkMode: 'class',
  theme: {
    extend: {
      // Colours are CSS variables (see index.css) so light/dark swap in one place
      colors: {
        paper:   token('paper'),
        surface: token('surface'),
        ink:     token('ink'),
        muted:   token('muted'),
        line:    token('line'),
        accent:  token('accent'),
        ok:      token('ok'),
        warn:    token('warn'),
        bad:     token('bad'),
        info:    token('info'),
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
      },
    },
  },
  plugins: [],
}
