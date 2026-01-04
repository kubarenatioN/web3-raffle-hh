import Placeholder from '@/features/placeholders/ui/Placeholder';
import { raffleContract } from '@/shared/config/contracts';
import { gqlPath } from '@/shared/config/gql-path';
import { Box } from '@/shared/ui-kit/Box';
import { IconBox } from '@/shared/ui-kit/IconBox';
import { Text } from '@/shared/ui-kit/Typography';
import { formatAddress } from '@/shared/utils/address';
import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { Users, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { formatEther } from 'viem/utils';
import { useReadContract } from 'wagmi';

const GET_PARTICIPANTS = gql`
  query GetParticipants($round: Int) {
    raffleEntereds(
      where: { round: $round }
      first: 50
      orderBy: blockNumber
      orderDirection: desc
    ) {
      id
      amount
      sender
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

interface IRaffleEntered {
  sender: string;
  amount: bigint;
}

function RaffleParticipants() {
  const { data: currentRound } = useReadContract({
    ...raffleContract,
    functionName: 's_roundsCount',
  });

  const { data: participants, isPending } = useQuery({
    queryKey: ['participants'],
    queryFn: () =>
      request(gqlPath(), GET_PARTICIPANTS, {
        round: Number(currentRound!.toString()),
      }),
    enabled: () => {
      return currentRound != null;
    },
  });

  const data = useMemo(() => {
    if (!participants) return [];

    const _pItems = participants.raffleEntereds as IRaffleEntered[];
    const result = _pItems.map((el) => {
      return {
        sender: el.sender,
        amount: formatEther(el.amount),
      };
    });

    return result;
  }, [participants]);

  return (
    <Box dir='column' css={{ gap: '1rem', height: '100%' }}>
      <Box css={{ gap: '6px', alignItems: 'center' }}>
        <IconBox colorType='sky'>
          <Users />
        </IconBox>
        <h4>Current Participants</h4>
      </Box>

      {isPending && (
        <Box
          dir='column'
          css={{ display: 'grid', flexGrow: 1, placeItems: 'center' }}
        >
          <Placeholder type='loading' />
        </Box>
      )}

      {!isPending && data.length === 0 && (
        <Box
          dir='column'
          css={{ display: 'grid', flexGrow: 1, placeItems: 'center' }}
        >
          <Placeholder type='empty' />
        </Box>
      )}

      {!isPending && data.length > 0 && (
        <Box
          dir='column'
          css={{
            gap: '0.8rem',
            overflowY: 'auto',
          }}
        >
          {data.map((el, i) => {
            return (
              <Box
                key={i}
                dir='column'
                css={{
                  gap: '8px',
                  backgroundColor:
                    'color-mix(in oklab, #1a1a1a 20%, transparent)',
                  boxShadow: '0 0 0 1px rgba(193, 127, 255, 0.5)',
                  padding: '0.6rem',
                  borderRadius: '8px',
                }}
              >
                <Box css={{ alignItems: 'center', gap: '6px' }}>
                  <Wallet size={12} color='#c27aff' />
                  <Text
                    css={{
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {formatAddress(el.sender)}
                  </Text>
                </Box>
                <Box
                  css={{
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <Text size='xs' css={{ color: '$pink-300' }}>
                    Bid amount
                  </Text>
                  <Text size='sm'>{el.amount} ETH</Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export default RaffleParticipants;
