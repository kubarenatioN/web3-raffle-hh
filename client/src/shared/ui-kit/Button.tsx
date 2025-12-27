import { styled } from '@/stitches.config';

export const Button = styled('button', {
  font: 'unset',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  color: 'inherit',
  cursor: 'pointer',

  '&[disabled]': {
    cursor: 'not-allowed',
    opacity: 0.6,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: 'rgb(138 138 138)',
        color: 'white',
      },
      accent: {
        backgroundColor: 'violet',
        color: 'white',
      },
      success: {
        backgroundColor: 'lime',
        color: 'white',
      },
    },
    size: {
      md: {
        padding: '0.6rem 1.2rem',
        fontSize: '0.96rem',
      },
      lg: {
        padding: '0.8rem 1.6rem',
        fontSize: '1.08rem',
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
