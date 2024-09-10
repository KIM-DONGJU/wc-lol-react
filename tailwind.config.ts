import type { Config } from 'tailwindcss';

const config: Config = {
  important: true,
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '460px',
      },
      height: {
        15: '3.75rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#00E3F1',
        secondary: '#43ffbe',
        'opacity-white': 'rgba(255, 255, 255, 0.08)',
      },
      gridTemplateColumns: {
        'user-list-table': '2fr 3fr 1fr 1fr 1fr 1fr 1fr',
      },
    },
  },
  plugins: [],
};
export default config;
