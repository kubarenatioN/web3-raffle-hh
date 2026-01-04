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
    align: {
      center: {
        alignItems: 'center',
      },
      baseline: {
        alignItems: 'baseline',
      },
      start: {
        alignItems: 'flex-start',
      },
      end: {
        alignItems: 'flex-end',
      },
    },
    gap: {
      xs: {
        gap: 4,
      },
      sm: {
        gap: 8,
      },
      md: {
        gap: 12,
      },
      md2: {
        gap: 16,
      },
      md3: {
        gap: 24,
      },
      lg: {
        gap: 32,
      },
      xl: {
        gap: 48,
      },
    },
  },

  defaultVariants: {
    dir: 'row',
  },
});

export const Section = styled(Box, {
  padding: '1.2rem',
  border: '1px solid',
  borderColor: '#d1d1d157',
  borderRadius: 8,
  backgroundColor: 'rgb(61 0 97 / 27%)',
});

export const SectionWrapper = styled('div', {
  padding: '1.2rem',
  border: '1px solid',
  borderColor: '#d1d1d157',
  borderRadius: 8,
  backgroundColor: 'rgb(61 0 97 / 27%)',
});

export const BoxCard = styled(Box, {
  padding: '1.1rem',
  borderRadius: 8,
  background: '$dark-400',
});
