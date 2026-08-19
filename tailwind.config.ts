import type { Config } from 'tailwind-merge';

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8e1616',
          container: '#6a0006',
          deep: '#731010',
        },
        gold: {
          DEFAULT: '#fed65b',
          fixed: '#fed65b',
          accent: '#d4af37',
        },
        parchment: {
          DEFAULT: '#fbf9f5',
          alt: '#f8f4ee',
        },
        silk: {
          DEFAULT: '#e8dfd5',
          border: '#e8dfd5',
        },
        charcoal: {
          connector: '#3d3731',
        },
        ink: {
          black: '#1f1d1d',
        },
      },
      fontFamily: {
        headline: ['Poppins', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
