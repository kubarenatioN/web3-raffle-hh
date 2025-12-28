import { Box, Button, FormInput } from '@/shared/ui-kit';
import { useCallback, useState } from 'react';
import { parseEther } from 'viem/utils';
import { useConnection, useWriteContract } from 'wagmi';
import { raffleContract } from '../../../shared/config/contracts';

interface IProps {
  defaultBidAmount: string;
  // changeBidAmount: (value: string) => void;
}

function RaffleEnter({ defaultBidAmount }: IProps) {
  const [bidAmount, setBidAmount] = useState<string | null>(null);
  const { isConnected } = useConnection();
  const { writeContract, isPending: pendingWrite } = useWriteContract();

  const changeBidAmount = (value: string) => {
    setBidAmount(value);
  };

  const enterRaffle = useCallback(
    (value: string) => {
      writeContract({
        ...raffleContract,
        functionName: 'enter',
        value: parseEther(value),
      });
    },
    [writeContract],
  );

  console.log(defaultBidAmount);

  return (
    <Box dir='column' css={{ gap: '12px' }}>
      <div>
        <FormInput
          type='number'
          label={'Your Bid Amount (ETH)'}
          suffix='ETH'
          inputMode='decimal'
          value={bidAmount != null ? bidAmount : defaultBidAmount}
          onChange={(e) => changeBidAmount(e.target.value)}
        />
      </div>

      {isConnected ? (
        <Button
          disabled={pendingWrite}
          size='lg'
          variant='accent'
          onClick={() =>
            enterRaffle(
              String(bidAmount != null ? bidAmount : defaultBidAmount),
            )
          }
        >
          Enter raffle
        </Button>
      ) : (
        <Button size='lg' variant='success' disabled={true}>
          Connect wallet to enter
        </Button>
      )}
    </Box>
  );
}

export default RaffleEnter;
