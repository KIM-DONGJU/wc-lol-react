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
      flex: {
        '1': '1 1 0',
      },
      backgroundImage: {
        'gradient-primary-100':
          'linear-gradient(270deg, rgba(225, 253, 255, 0) 0%, rgba(0, 227, 241, 0.4) 100%)',
      },
      colors: {
        'primary-100': '#00E3F1',
        'primary-200': '#AAFAFF',
        secondary: '#43ffbe',
        'opacity-white-80': 'rgba(255, 255, 255, 0.8)',
        'opacity-white-50': 'rgba(255, 255, 255, 0.5)',
        'opacity-white-25': 'rgba(255, 255, 255, 0.25)',
        'opacity-white-8': 'rgba(255, 255, 255, 0.08)',
        'opacity-white-5': 'rgba(255, 255, 255, 0.05)',
      },
      gridTemplateColumns: {
        'user-list-table': '2fr 3fr 1fr 1fr 1fr 1fr 1fr',
        'user-stats-table': '2fr 2fr 2fr 2fr 4fr',
      },
    },
  },
  plugins: [],
};
export default config;
