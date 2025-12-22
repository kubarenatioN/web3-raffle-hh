import { styled } from '@/stitches.config';
import type { PropsWithChildren } from 'react';

const Wrapper = styled('div', {
  display: 'flex',
  placeItems: 'center',
  borderRadius: '8px',
  backgroundColor: 'transparent',

  variants: {
    size: {
      sm: {
        padding: '6px',
      },
      md: {
        padding: '8px',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

type ColorType = 'pink' | 'sky' | 'lime' | 'orange';

export function IconBox({
  children,
  bgColor,
  colorType,
}: PropsWithChildren<{
  bgColor?: string;
  colorType?: ColorType;
}>) {
  const _bgColor = colorType ? colorTypeToColor(colorType) : bgColor;
  return <Wrapper css={{ background: _bgColor }}>{children}</Wrapper>;
}

function colorTypeToColor(colorType: ColorType) {
  switch (colorType) {
    case 'pink':
      return 'linear-gradient(140deg, rgb(248, 45, 255) 0%, rgb(143, 21, 230) 100%)';
    case 'sky':
      return 'linear-gradient(130deg,rgb(84, 238, 255) 0%,rgb(63, 115, 238) 100%)';
    case 'lime':
      return 'linear-gradient(150deg,rgb(104, 231, 35) 0%,rgb(0, 142, 21) 100%)';
    case 'orange':
      return 'linear-gradient(140deg,rgb(255, 168, 76) 0%, rgb(232, 129, 3) 100%)';
    default:
      return 'linear-gradient(140deg,rgb(248 45 255) 0%, rgb(35 46 223) 100%)';
  }
}

export type { ColorType as IconBoxColorType };
