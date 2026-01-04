import { createStitches } from '@stitches/react';

export const { styled, css, reset } = createStitches({
  prefix: 'raffle',
  theme: {
    colors: {
      'pink-100': '#e9d4ff',
      'pink-300': '#dab2ff',
      'pink-400': '#c27aff',
      'purple-400': '#bf1fe3',
      'green-100': '#a8f6d1',
      'green-200': '#96ffa4',
      'green-400': '#00e100',
      'green-700': '#155437',
      'dark-400': '#2e0155',
      'success-400': '#028c3f',
      'gold-400': '#fdc700',
    },
  },
  media: {
    xs: '(min-width: 480px)',
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
  },
  utils: {
    paddingX: (val: string) => {
      return {
        paddingLeft: val,
        paddingRight: val,
      };
    },
  },
});
