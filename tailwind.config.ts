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
        18: '4.5rem',
        30: '7.5rem',
        50: '12.5rem',
        100: '25rem',
        150: '37.5rem',
      },
      height: {
        7.5: '1.875rem',
        15: '3.75rem',
        18: '4.5rem',
        125: '31.25rem',
      },
      padding: {
        29: '7.25rem',
      },
      fontSize: {
        '3xl': '1.75rem',
        '5xl': '2.5rem',
      },
      flex: {
        '1': '1 1 0',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        md: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
      borderImage: {
        'primary-gradient': 'linear-gradient(90deg, #00838B 0%, #00E3F1 100%) 1',
      },
      opacity: {
        8: '0.08',
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
        'gradient-primary-600':
          'linear-gradient(270deg, rgba(225, 253, 255, 0) 0%, rgba(146, 244, 250, 0.14) 0.01%, rgba(0, 227, 241, 0.4) 100%)',
        'gradient-primary-700':
          'linear-gradient(90deg, rgba(0, 180, 237, 0.35) 0%, rgba(0, 232, 241, 0.14) 50.69%, rgba(0, 255, 233, 0.7) 100%)',
        'gradient-primary-800':
          'linear-gradient(90deg, rgba(0, 180, 237, 0.7) 0%, rgba(0, 232, 241, 0.7) 88%, rgba(0, 255, 233, 0.7) 100%)',
      },
      colors: {
        'primary-100': '#00E3F1',
        'primary-200': '#AAFAFF',
        'primary-300': '#A8FAFF',
        'primary-gradient': `linear-gradient(90deg, #00838B 0%, #00E3F1 100%)`,
        secondary: '#43ffbe',
        'opacity-white-50': 'rgba(255, 255, 255, 0.5)',
        gold: '#D3C7AA',
        gray: '#D0DAE3',
        'light-gray': '#9199A4',
        'light-black': '#1A1A1A',
        success: '#00b4ed',
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
