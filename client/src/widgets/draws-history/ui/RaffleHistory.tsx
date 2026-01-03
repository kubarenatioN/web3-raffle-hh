import RaffleWinnerItem from '@/features/raffle-winner-item/ui/RaffleWinnerItem';
import { gqlPath } from '@/shared/config/gql-path';
import { Box } from '@/shared/ui-kit/Box';
import { IconBox } from '@/shared/ui-kit/IconBox';
import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { FileClock } from 'lucide-react';
import { useMemo } from 'react';
import { type Address } from 'viem';
import { type IRaffleRoundRecord } from './RaffleRoundRecord';

const GET_ROUNDS_HISTORY = gql`
  query GetWinnersHistory {
    raffleWinnerPickeds(first: 10, orderBy: blockNumber, orderDirection: desc) {
      id
      round
      winner
      fundsDrawn
      participantsCount
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

interface IRaffleWinnerRecord {
  round: string;
  winner: Address;
  fundsDrawn: bigint;
  participantsCount: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RaffleHistory({ items }: { items: IRaffleRoundRecord[] }) {
  const { data: winnersHistoryResponse, isPending } = useQuery({
    queryKey: ['winnersHistoryResponse'],
    queryFn: () => request(gqlPath(), GET_ROUNDS_HISTORY),
  });

  const data = useMemo(() => {
    if (!winnersHistoryResponse) return [];

    const _winners =
      winnersHistoryResponse.raffleWinnerPickeds as IRaffleWinnerRecord[];

    const result = _winners.map((el) => {
      return {
        address: el.winner,
        round: Number(el.round),
        fundsDrawn: el.fundsDrawn,
        participantsCount: Number(el.participantsCount),
        txHash: el.transactionHash,
      };
    });

    return result;
  }, [winnersHistoryResponse]);

  return (
    <Box dir='column' css={{ gap: '12px' }}>
      <Box css={{ gap: '6px', alignItems: 'center' }}>
        <IconBox colorType='lime'>
          <FileClock />
        </IconBox>
        <h4>Draws History</h4>
      </Box>

      {isPending && <div>Loading...</div>}

      {!isPending && data.length > 0 && (
        <Box dir='column' css={{ gap: '1rem' }}>
          {data.map((item) => (
            <RaffleWinnerItem key={item.txHash} data={item} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default RaffleHistory;
