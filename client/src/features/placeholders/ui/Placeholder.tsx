import { Box } from '@/shared/ui-kit';
import { styled } from '@/stitches.config';
import { keyframes } from '@stitches/react';
import { FileSearch, Loader2 } from 'lucide-react';

const PlaceholderWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
});

function Placeholder({
  type = 'empty',
  size = 64,
}: {
  type?: 'empty' | 'loading';
  size?: number;
}) {
  if (type === 'empty') {
    return (
      <PlaceholderWrapper>
        <FileSearch size={size} opacity={0.8} />
        <span>No data</span>
      </PlaceholderWrapper>
    );
  }

  if (type === 'loading') {
    return (
      <PlaceholderWrapper>
        <Box css={{ animation: `${rotate} 1s linear infinite` }}>
          <Loader2 size={size} opacity={0.8} />
        </Box>
        <span>Loading...</span>
      </PlaceholderWrapper>
    );
  }

  return null;
}

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export default Placeholder;
