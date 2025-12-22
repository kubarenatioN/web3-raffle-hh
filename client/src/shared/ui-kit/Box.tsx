import { styled } from '@/stitches.config';

export const Box = styled('div', {
  display: 'flex',

  variants: {
    dir: {
      row: {
        flexDirection: 'row',
      },
      column: {
        flexDirection: 'column',
      },
    },
  },

  defaultVariants: {
    dir: 'row',
  },
});

export const Section = styled('div', {
  padding: '1.2rem',
  border: '1px solid',
  borderColor: '#d1d1d157',
  borderRadius: 8,
  backgroundColor: 'rgb(61 0 97 / 27%)',
});
