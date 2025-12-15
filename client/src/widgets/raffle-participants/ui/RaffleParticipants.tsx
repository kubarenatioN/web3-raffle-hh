import { gqlPath } from '@/shared/config/gql-path';
import { Box } from '@/shared/ui-kit/Box';
import { IconBox } from '@/shared/ui-kit/IconBox';
import { Text } from '@/shared/ui-kit/Typography';
import { formatAddress } from '@/shared/utils/address';
import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { Users } from 'lucide-react';
import { useMemo } from 'react';
import { formatEther } from 'viem/utils';

const GET_PARTICIPANTS = gql`
  query GetParticipants {
    raffleEntereds {
      amount
      blockNumber
      blockTimestamp
      id
      sender
      transactionHash
    }
  }
`;

interface IRaffleEntered {
  sender: string;
  amount: bigint;
}

function RaffleParticipants() {
  const { data: participants, isPending } = useQuery({
    queryKey: ['participants'],
    queryFn: () => request(gqlPath(), GET_PARTICIPANTS),
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

  console.log('participants', data);

  return (
    <div style={{ overflowWrap: 'anywhere' }}>
      <Box css={{ gap: '6px', alignItems: 'center' }}>
        <IconBox bgColor='linear-gradient(120deg, #00d2ff 0%, #3a47d5 100%)'>
          <Users />
        </IconBox>
        <h4>Current Participants</h4>
      </Box>

      {isPending ? (
        <div>Loading...</div>
      ) : (
        <Box dir='column' css={{ gap: '0.8rem', padding: '0.8rem 0' }}>
          {data.map((el, i) => {
            return (
              <Box key={i} dir='column'>
                <Text size='sm'>Address: {formatAddress(el.sender)}</Text>
                <Text size='sm'>Amount: {el.amount} ETH</Text>
              </Box>
            );
          })}
        </Box>
      )}
    </div>
  );
}

export default RaffleParticipants;
