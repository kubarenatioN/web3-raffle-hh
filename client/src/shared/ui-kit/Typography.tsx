import { styled } from '@/stitches.config';

export const Text = styled('p', {
  fontSize: '1rem',
  fontWeight: '400',

  variants: {
    size: {
      sm: {
        fontSize: '0.875rem',
      },
      md: {
        fontSize: '1rem',
      },
      lg: {
        fontSize: '1.125rem',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});
