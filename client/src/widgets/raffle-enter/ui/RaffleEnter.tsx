import { useCallback, useState } from 'react';
import { parseEther } from 'viem/utils';
import { useWriteContract } from 'wagmi';
import { raffleContract } from '../../../shared/config/contracts';

interface IProps {
  defaultBidAmount: string;
  // changeBidAmount: (value: string) => void;
}

function RaffleEnter({ defaultBidAmount }: IProps) {
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const { writeContract, isPending: pendingWrite } = useWriteContract();

  const changeBidAmount = (value: string) => {
    const _decimal = Number(value);
    if (!Number.isNaN(_decimal)) {
      setBidAmount(_decimal);
    }
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
          type='text'
          value={bidAmount != null ? bidAmount : defaultBidAmount}
          onChange={(e) => changeBidAmount(e.target.value)}
        />
      </div>

      <div>
        <button
          disabled={pendingWrite}
          onClick={() => enterRaffle(String(bidAmount))}
        >
          Enter raffle
        </button>
      </div>
    </div>
  );
}

export default RaffleEnter;
