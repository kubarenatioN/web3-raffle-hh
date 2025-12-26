import { Box } from '@/shared/ui-kit/Box';
import { IconBox } from '@/shared/ui-kit/IconBox';
import { Text } from '@/shared/ui-kit/Typography';
import { Ticket } from 'lucide-react';
import { useMemo } from 'react';
import { formatEther, formatUnits } from 'viem/utils';
import { useReadContract, useReadContracts } from 'wagmi';
import { raffleContract } from '../../../shared/config/contracts';
import RaffleEnter from '../../raffle-enter/ui/RaffleEnter';

function CurrentRound() {
  const { data: feePriceEthResponse = 0n } = useReadContract({
    ...raffleContract,
    functionName: 'getFeePriceEth',
  });

  const { data: [totalRoundBalanceResponse, dataFeedAnswerResponse] = [] } =
    useReadContracts({
      contracts: [
        {
          ...raffleContract,
          functionName: 's_totalBalance',
        },
        {
          ...raffleContract,
          functionName: 'getPriceFeedAnswer',
        },
      ],
    });

  const { result: totalRoundBalance = 0n } = totalRoundBalanceResponse ?? {};
  const { result: dataFeedAnswer = 0n } = dataFeedAnswerResponse ?? {};

  const feePriceStr = useMemo(() => {
    const res = feePriceEthResponse;
    const feePrice = formatEther(res);

    return feePrice;
  }, [feePriceEthResponse]);

  const formattedFeePrice = useMemo(() => {
    const [integerPart, decimalPart = '000000'] = feePriceStr.split('.');

    return `${integerPart}.${decimalPart.substring(0, 6)}`;
  }, [feePriceStr]);

  const roundPrizePoolEth = useMemo(() => {
    const balanceStr = totalRoundBalance ? formatEther(totalRoundBalance) : '0';
    return balanceStr;
  }, [totalRoundBalance]);

  const roundPrizePoolUsd = useMemo(() => {
    const dataFeedDecimals = 10n ** 8n;

    const totalRoundBalanceWei =
      (dataFeedAnswer * totalRoundBalance) / dataFeedDecimals;

    const formattedUsd = formatUnits(totalRoundBalanceWei, 18);

    return Number(formattedUsd).toFixed(2);
  }, [totalRoundBalance, dataFeedAnswer]);

  return (
    <Box dir='column' css={{ gap: '1.5rem' }}>
      <Box css={{ gap: '6px', alignItems: 'center' }}>
        <IconBox colorType='pink'>
          <Ticket />
        </IconBox>
        <h4>Round #{1}</h4>
      </Box>

      <Box>
        <Box dir='column' css={{ gap: '6px', '@bp1': { direction: 'row' } }}>
          <div>
            <Text weight='medium'>Prize pool</Text>
            <br /> {roundPrizePoolEth} ETH
          </div>
          <Text as='span' size='sm'>
            ≈${roundPrizePoolUsd} USD
          </Text>
        </Box>
      </Box>

      <Box dir='column' css={{ gap: '6px' }}>
        <Text>Minimum entry price: {formattedFeePrice} ETH</Text>
        <Text size='sm' css={{ maxWidth: '420px' }}>
          Your chance of winning increases with your bid amount. Winner selected
          randomly using Chainlink VRF for provable fairness.
        </Text>
      </Box>

      <RaffleEnter defaultBidAmount={formattedFeePrice} />
    </Box>
  );
}

export default CurrentRound;
