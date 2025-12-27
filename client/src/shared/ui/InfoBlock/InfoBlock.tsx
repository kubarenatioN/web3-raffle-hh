import { styled } from '@/stitches.config';
import { Info } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Box } from '../../ui-kit/Box';

const Wrapper = styled(Box, {
  padding: '1rem',
  border: '1px solid',
  borderColor: '#d1d1d157',
  borderRadius: 8,
  backgroundColor: 'rgb(10 73 128 / 49%)',
});

export function InfoBlock({
  children,
}: PropsWithChildren<{ children: React.ReactNode }>) {
  return (
    <Wrapper css={{ gap: '10px', color: '#d2efff' }}>
      <Box css={{ color: '#56a2ff' }}>
        <Info size={18} color={'currentColor'} />
      </Box>
      <Box dir={'column'} css={{ gap: '6px' }}>
        {children}
      </Box>
    </Wrapper>
  );
}
