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
      width: {
        12.5: '3.125rem',
        18: '4.5rem',
        30: '7.5rem',
        50: '12.5rem',
      },
      height: {
        12.5: '3.125rem',
        15: '3.75rem',
        7.5: '1.875rem',
      },
      flex: {
        '1': '1 1 0',
      },
      borderImage: {
        'primary-gradient': 'linear-gradient(90deg, #00838B 0%, #00E3F1 100%) 1',
      },
      backgroundImage: {
        'gradient-primary-100':
          'linear-gradient(270deg, rgba(225, 253, 255, 0) 0%, rgba(0, 227, 241, 0.4) 100%)',
        'gradient-primary-200':
          'linear-gradient(90deg, rgba(0, 131, 139, 0.1) 0%, rgba(0, 227, 241, 0.1) 100%)',
        'gradient-primary-300':
          'linear-gradient(270deg, rgba(0, 180, 237, 0.184) 0%, rgba(225, 253, 255, 0) 100%)',
        'gradient-primary-400':
          'linear-gradient(270deg, rgba(255, 255, 255, 0.03) 0%, rgba(153, 153, 153, 0.1) 100%)',
        'gradient-primary-500':
          'linear-gradient(270deg, rgba(225, 253, 255, 0) 0%, rgba(0, 180, 237, 0.4) 100%)',
      },
      colors: {
        'primary-100': '#00E3F1',
        'primary-200': '#AAFAFF',
        'primary-300': '#A8FAFF',
        'primary-gradient': `linear-gradient(90deg, #00838B 0%, #00E3F1 100%)`,
        secondary: '#43ffbe',
        'opacity-white-80': 'rgba(255, 255, 255, 0.8)',
        'opacity-white-50': 'rgba(255, 255, 255, 0.5)',
        'opacity-white-25': 'rgba(255, 255, 255, 0.25)',
        'opacity-white-10': 'rgba(255, 255, 255, 0.1)',
        'opacity-white-8': 'rgba(255, 255, 255, 0.08)',
        'opacity-white-5': 'rgba(255, 255, 255, 0.05)',
        gold: '#D3C7AA',
        'opacity-gold-80': 'rgba(211, 199, 170, 0.8)',
        'opacity-gold-40': 'rgba(211, 199, 170, 0.5)',
      },
      gridTemplateColumns: {
        'user-list-table': '2fr 3fr 1fr 1fr 1fr 1fr 1fr',
        'user-stats-table': '2fr 2fr 2fr 2fr 4fr',
        'match-user-table': '58px 1fr 1fr',
      },
    },
  },
  plugins: [],
};
export default config;
