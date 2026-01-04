import { styled } from '@/stitches.config';

export const Button = styled('button', {
  font: 'unset',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  textAlign: 'center',

  '&[disabled]': {
    cursor: 'not-allowed',
    opacity: 0.6,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: 'rgb(138 138 138)',
        color: '#fff',
      },
      accent: {
        backgroundColor: '$purple-400',
        color: '#fff',
      },
      success: {
        backgroundColor: '$success-400',
        color: '#fff',
      },
      outline: {
        backgroundColor: 'rgb(172 123 210 / 19%)',
        boxShadow: '0px 0px 0px 1px rgb(202 155 242 / 45%)',
        color: '$pink-300',
        '&:hover': {
          color: '$pink-100',
        },
      },
    },
    size: {
      sm: {
        padding: '0.4rem 0.8rem',
        fontSize: '0.88rem',
        borderRadius: '4px',
      },
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
    size: 'md',
  },

  fontWeight: '500',
});
