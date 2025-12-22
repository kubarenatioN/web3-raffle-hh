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
      xl: {
        fontSize: '1.25rem',
      },
    },
    weight: {
      normal: {
        fontWeight: '400',
      },
      medium: {
        fontWeight: '500',
      },
      bold: {
        fontWeight: '700',
      },
    },
  },

  defaultVariants: {
    size: 'md',
    weight: 'normal',
  },
});
