import { styled } from '@/stitches.config';
import type { PropsWithChildren } from 'react';

const Wrapper = styled('div', {
  display: 'flex',
  placeItems: 'center',
  borderRadius: '6px',
  backgroundColor: 'transparent',

  variants: {
    size: {
      sm: {
        padding: '4px',
      },
      md: {
        padding: '6px',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

export function IconBox({
  children,
  bgColor,
}: PropsWithChildren<{ bgColor?: string }>) {
  return <Wrapper css={{ background: bgColor }}>{children}</Wrapper>;
}
