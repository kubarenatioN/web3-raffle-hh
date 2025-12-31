import { createStitches } from '@stitches/react';

export const { styled, css } = createStitches({
  theme: {
    colors: {
      'pink-100': '#e9d4ff',
      pink300: '#dab2ff',
      pink400: '#c27aff',
      purple400: '#bf1fe3',
      green100: '#a8f6d1',
      green200: '#96ffa4',
      dark400: '#2e0155',
      success400: '#028c3f',
    },
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
