import { Box, BoxCard, Text } from '@/shared/ui-kit';
import Address from '@/shared/ui/Address/Address';
import { CheckCircle, ExternalLink, Trophy } from 'lucide-react';
import { formatEther } from 'viem/utils';

interface IRaffleWinnerItem {
  address: string;
  participantsCount: number;
  fundsDrawn: bigint;
  txHash: string;
  round: number;
}

function RaffleWinnerItem({ data }: { data: IRaffleWinnerItem }) {
  const { address, round, participantsCount, fundsDrawn, txHash } = data;

  return (
    <BoxCard
      dir='column'
      css={{
        padding: '1.1rem 0.9rem 1rem',
        gap: 12,
        borderRadius: 8,
      }}
    >
      <Box
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box css={{ alignItems: 'center', gap: '6px' }}>
          <CheckCircle color='#00e100' size={18} />
          <Text size='lg'>Round #{round + 1}</Text>
        </Box>

        <Box dir='column' css={{ alignItems: 'flex-end', gap: 6 }}>
          <Text size='md' css={{ color: '$gold-400' }}>
            {formatEther(fundsDrawn)} ETH
          </Text>
          <Text size='xs' css={{ color: '$pink-300' }}>
            {participantsCount} participants
          </Text>
        </Box>
      </Box>

      <Box
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid',
          borderColor: '#b37bf647',
        }}
      >
        <Box css={{ alignItems: 'center', gap: 8 }}>
          <Trophy color='#fdc700' size={16} />
          <Box css={{ alignItems: 'baseline', gap: 4 }}>
            <Text as='span' size='sm' css={{ color: '$pink-100' }}>
              Winner:
            </Text>
            <Address>{address}</Address>
          </Box>
        </Box>

        <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target='_blank'>
          <Text
            as='span'
            size='sm'
            css={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>View TX</span>
            <ExternalLink size={16} />
          </Text>
        </a>
      </Box>
    </BoxCard>
  );
}

export default RaffleWinnerItem;
