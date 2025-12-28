import { createStitches } from '@stitches/react';

export const { styled, css } = createStitches({
  theme: {
    colors: {
      pink100: '#e9d4ff',
      pink300: '#dab2ff',
      pink400: '#c27aff',
      dark400: '#2e0155',
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
