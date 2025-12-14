import { createStitches } from '@stitches/react';

export const { styled, css } = createStitches({
  theme: {
    colors: {
      gray400: 'gainsboro',
      gray500: 'lightgray',
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
