import { raffleContract } from '@/shared/config/contracts';
import {
  Box,
  Button,
  FormInput,
  IconBox,
  Section,
  Text,
} from '@/shared/ui-kit';
import { ethToUsd } from '@/shared/utils/converters';
import { Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatEther, type Address } from 'viem';
import { useReadContract } from 'wagmi';

function RaffleWithdraw({ address }: { address: Address }) {
  const [withdrawAmount, setWithdrawAmount] = useState<string | null>(null);

  const { data: winnerBalance } = useReadContract({
    ...raffleContract,
    functionName: 's_winnerBalance',
    args: [address!],
  });

  const { data: priceFeedAnswer } = useReadContract({
    ...raffleContract,
    functionName: 'getPriceFeedAnswer',
  });

  const totalWithdrawAmountUSD = useMemo(() => {
    if (priceFeedAnswer == null) {
      return 0n;
    }

    const amount = Number.parseFloat(formatEther(winnerBalance ?? 0n));

    const result = ethToUsd(amount, priceFeedAnswer);
    return result.toFixed(4);
  }, [winnerBalance, priceFeedAnswer]);

  const withdrawAmountUSD = useMemo(() => {
    if (priceFeedAnswer == null) {
      return null;
    }

    const amount = Number.isNaN(Number(withdrawAmount))
      ? 0
      : Number(withdrawAmount);

    return ethToUsd(amount, priceFeedAnswer);
  }, [withdrawAmount, priceFeedAnswer]);

  console.log('raffle withdraw', winnerBalance);

  return (
    <Box dir='column' css={{ gap: 16 }}>
      <Box css={{ gap: '6px', alignItems: 'center' }}>
        <IconBox colorType='greenblue'>
          <Trophy />
        </IconBox>
        <h4>Your Winnings</h4>
      </Box>

      <Section
        dir='column'
        css={{
          gap: '12px',
          borderColor: '#00c95180',
        }}
        className={`success-gradient`}
      >
        <Text size='sm'>Total Unclaimed</Text>
        <Text size='xl'>{formatEther(winnerBalance ?? 0n)} ETH</Text>
        <Text size='sm'>≈ ${totalWithdrawAmountUSD} USD</Text>
      </Section>

      <Box dir='column' css={{ gap: '6px' }}>
        <FormInput
          label='Withdraw Amount'
          suffix='ETH'
          type='number'
          step='0.001'
          inputMode='decimal'
          value={
            withdrawAmount != null
              ? withdrawAmount
              : formatEther(winnerBalance ?? 0n)
          }
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <Text size='xs'>≈ ${withdrawAmountUSD} USD</Text>
      </Box>

      <Button size='lg' variant='success'>
        Withdraw
      </Button>
    </Box>
  );
}

export default RaffleWithdraw;
