import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#105419',
        'primary-pink': '#FAA49A',
        'primary-wine': '#3B0A0A',
        'primary-red': '#C4391D',
        'green-dark': '#0a3510',
        'green-light': '#dcfce7',
        'pink-light': '#fee2e2',
        'wine-dark': '#2d0808',
        'red-dark': '#991b1b',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
