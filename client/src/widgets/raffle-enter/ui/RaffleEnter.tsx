import { Box, Button, FormInput, Text } from '@/shared/ui-kit';
import { ethToUsd } from '@/shared/utils/converters';
import { css } from '@/stitches.config';
import { useCallback, useMemo, useState } from 'react';
import { parseEther } from 'viem/utils';
import { useConnection, useReadContract, useWriteContract } from 'wagmi';
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

  const { data: priceFeedAnswer } = useReadContract({
    ...raffleContract,
    functionName: 'getPriceFeedAnswer',
  });

  const enterAmountUSD = useMemo(() => {
    if (priceFeedAnswer == null) {
      return 0;
    }

    let amount = 0;
    if (bidAmount == null) {
      amount = Number.parseFloat(defaultBidAmount);
    } else {
      amount = Number.isNaN(Number(bidAmount)) ? 0 : Number(bidAmount);
    }

    return ethToUsd(amount, priceFeedAnswer);
  }, [bidAmount, priceFeedAnswer, defaultBidAmount]);

  return (
    <Box dir='column' css={{ gap: '12px' }}>
      <Box dir='column' css={{ gap: '6px' }}>
        <FormInput
          type='number'
          label={
            <label className={`${css({ color: '$pink-100' })}`}>
              Your Bid Amount (ETH)
            </label>
          }
          suffix='ETH'
          min={0}
          inputMode='decimal'
          value={bidAmount != null ? bidAmount : defaultBidAmount}
          onChange={(e) => changeBidAmount(e.target.value)}
          step='0.001'
        />
        <Text size='xs' css={{ color: '$pink300' }}>
          ≈ ${enterAmountUSD.toFixed(4)} USD
        </Text>
      </Box>

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
