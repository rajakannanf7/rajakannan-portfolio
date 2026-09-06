/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08080A',
        ink2: '#0C0C10',
        panel: '#14141A',
        bone: '#EDEDE8',
        mute: '#7A7A80',
        faint: '#55555E',
        dim: '#6E6E78',
        violet: '#7C5CFF',
        orchid: '#A46BF0',
        halo: '#C9BFFF',
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        label: '0.28em',
        chip: '0.12em',
      },
      maxWidth: { shell: '1440px' },
      borderRadius: { panel: '22px', card: '18px', tile: '14px' },
      transitionTimingFunction: { swift: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    },
  },
  plugins: [],
};
