/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/App.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/views/**/*.{js,ts,jsx,tsx}',
    '../../packages/uikit/src/components/**/*.{js,ts,jsx,tsx}',
    '../../packages/uikit/src/widgets/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-wallets/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'azureish-white': 'var(--azureish-white)',
        'beau-blue': 'var(--beau-blue)',
        'black-russian': 'var(--black-russian)',
        'blue-bolt': 'var(--blue-bolt)',
        'blue-jeans': 'var(--blue-jeans)',
        'bright-gray': 'var(--bright-gray)',
        'catalina-blue': 'var(--catalina-blue)',
        'cetacean-blue': 'var(--cetacean-blue)',
        'chinese-silver': 'var(--chinese-silver)',
        'crystal-blue': 'var(--crystal-blue)',
        'dark-imperial-blue': 'var(--dark-imperial-blue)',
        'dark-orchid': 'var(--dark-orchid)',
        'fresh-blue': 'var(--fresh-blue)',
        'gold-foil': 'var(--gold-foil)',
        'indigo-rainbow': 'var(--indigo-rainbow)',
        'lincoln-green': 'var(--lincoln-green)',
        'maastricht-blue': 'var(--maastricht-blue)',
        'medium-aquamarine': 'var(--medium-aquamarine)',
        'medium-blue': 'var(--medium-blue)',
        'mint-cream': 'var(--mint-cream)',
        'naples-yellow': 'var(--naples-yellow)',
        'oxford-blue': 'var(--oxford-blue)',
        'pale-cerulean': 'var(--pale-cerulean)',
        'pale-sky': 'var(--pale-sky)',
        'ripe-mango': 'var(--ripe-mango)',
        'space-blue': 'var(--space-blue)',
        'ultramarine-blue': 'var(--ultramarine-blue)',
        'yellow-munsell': 'var(--yellow-munsell)',
        bubbly: 'var(--bubbly)',
        cultured: 'var(--cultured)',
        mist: 'var(--mist)',
        peach: 'var(--peach)',
        rackley: 'var(--rackley)',
      },
      borderWidth: {
        3: '3px',
        1: '1px',
      },
      borderRadius: {
        '4xl': '1.75rem',
        '5xl': '2rem',
      },
      backgroundImage: {
        'ecosystem-pattern': `url('/assets/ecosystem-pattern.png')`,
        glow: `url('/assets/glow.png')`,
        'glow-2': `url('/assets/glow-2.png')`,
        'glow-3': `url('/assets/glow-3.webp')`,
        'wave-pattern-1': `url('/assets/wave-pattern-1.png')`,
      },
      zIndex: {
        1: '1',
      },
      spacing: {
        em: '1em',
      },
      animation: {
        ellipsis: 'ellipsis 1.25s infinite',
        'scroll-vertical': 'scrollV 6.24s linear 0s infinite',
        'scroll-horizontal': 'scrollH 18.24s linear 0s infinite',
      },
      keyframes: {
        ellipsis: {
          '0%': {
            content: `'.'`,
          },
          '33%': {
            content: `'..'`,
          },
          '66%': {
            content: `'...'`,
          },
        },
        scrollV: {
          '0%': {
            transform: 'translateY(0%)',
          },
          '100%': {
            transform: 'translateY(-100%)',
          },
        },
        scrollH: {
          '0%': {
            transform: 'translateX(0%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
    screens: {
      '2xl': { max: '1535px' },
      // => @media (max-width: 1535px) { ... }

      xl: { max: '1279px' },
      // => @media (max-width: 1279px) { ... }

      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }

      md: { max: '767px' },
      // => @media (max-width: 767px) { ... }

      sm: { max: '639px' },
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
