import { Box, BoxCard, Button, Text } from '@/shared/ui-kit';
import { getTimeSince } from '@/shared/utils/date';
import { css } from '@/stitches.config';
import { BanknoteArrowDown, ExternalLink } from 'lucide-react';
import { formatEther } from 'viem';

interface IWithdrawItem {
  id: string;
  amount: bigint;
  blockTimestamp: number;
  transactionHash: string;
}

function WithdrawItem({ data }: { data: IWithdrawItem }) {
  const { amount, blockTimestamp, transactionHash } = data;

  return (
    <BoxCard
      dir='column'
      css={{ gap: '0.6rem', padding: '1rem 0.8rem 0.8rem' }}
    >
      <Box
        css={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        <Box css={{ alignItems: 'center', gap: 6 }}>
          <Box
            css={{
              padding: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '$green-700',
              borderRadius: 6,
            }}
          >
            <BanknoteArrowDown
              size={20}
              className={`${css({
                color: '$green-400',
              })}`}
            />
          </Box>
          <Text size='md'>{formatEther(amount)} ETH</Text>
        </Box>
        <Text as='span' size='xs' css={{ color: '$pink-400' }}>
          {getTimeSince(blockTimestamp)}
        </Text>
      </Box>
      <Box
        dir='column'
        css={{
          paddingTop: '0.8rem',
          borderTop: '1px solid',
          borderColor: '#b37bf647',
        }}
      >
        <Button
          variant='outline'
          size='sm'
          as='a'
          href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
          target='_blank'
        >
          <Box
            as='span'
            css={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            View on Etherscan <ExternalLink size={14} />
          </Box>
        </Button>
      </Box>
    </BoxCard>
  );
}

export default WithdrawItem;
