import { css } from '@/stitches.config';

export const flex = css({
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
