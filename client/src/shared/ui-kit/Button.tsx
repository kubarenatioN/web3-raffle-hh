import { styled } from '@/stitches.config';

export const Button = styled('button', {
  font: 'unset',
  border: 'none',
  borderRadius: '9999px',
  backgroundColor: 'transparent',
  color: 'inherit',
  cursor: 'pointer',

  variants: {
    variant: {
      primary: {
        backgroundColor: 'gray',
        color: 'white',
      },
      accent: {
        backgroundColor: 'violet',
        color: 'white',
      },
    },
    size: {
      md: {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
      },
      lg: {
        padding: '1rem 2rem',
        fontSize: '1.125rem',
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export const ConnectWalletButton = styled(Button, {
  defaultVariants: {
    variant: 'accent',
    size: 'lg',
  },

  fontWeight: '500',
});
