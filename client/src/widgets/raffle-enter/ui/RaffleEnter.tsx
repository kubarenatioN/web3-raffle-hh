import { Button } from '@/shared/ui-kit/Button';
import { useCallback, useState } from 'react';
import { parseEther } from 'viem/utils';
import { useWriteContract } from 'wagmi';
import { raffleContract } from '../../../shared/config/contracts';

interface IProps {
  defaultBidAmount: string;
  // changeBidAmount: (value: string) => void;
}

function RaffleEnter({ defaultBidAmount }: IProps) {
  const [bidAmount, setBidAmount] = useState<string | null>(null);
  const { writeContract, isPending: pendingWrite } = useWriteContract();

  const changeBidAmount = (value: string) => {
    setBidAmount(value);
  };

  const enterRaffle = useCallback(
    (value: string) => {
      writeContract({
        ...raffleContract,
        functionName: 'enter',
        args: [],
        value: parseEther(value),
      });
    },
    [writeContract],
  );

  return (
    <div>
      <div>
        <label htmlFor='bid-amount'>Enter your bid amount:</label>
        <br />
        <input
          id='bid-amount'
          style={{ minWidth: 200 }}
          type='number'
          value={bidAmount != null ? bidAmount : defaultBidAmount}
          onChange={(e) => changeBidAmount(e.target.value)}
        />
      </div>

      <div>
        <Button
          disabled={pendingWrite}
          onClick={() =>
            enterRaffle(
              String(bidAmount != null ? bidAmount : defaultBidAmount),
            )
          }
        >
          Enter raffle
        </Button>
      </div>
    </div>
  );
}

export default RaffleEnter;
