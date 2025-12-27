import { Box, BoxCard, IconBox, InfoBlock, Text } from '@/shared/ui-kit';
import { Coins, Ticket } from 'lucide-react';
import { useMemo } from 'react';
import { formatEther, formatUnits } from 'viem/utils';
import { useReadContract, useReadContracts } from 'wagmi';
import { raffleContract } from '../../../shared/config/contracts';
import RaffleEnter from '../../raffle-enter/ui/RaffleEnter';

function CurrentRound() {
  const { data: roundsCount } = useReadContract({
    ...raffleContract,
    functionName: 's_roundsCount',
  });

  const { data: pricingData } = useReadContracts({
    contracts: [
      {
        ...raffleContract,
        functionName: 's_totalBalance',
      },
      {
        ...raffleContract,
        functionName: 'getPriceFeedAnswer',
      },
      {
        ...raffleContract,
        functionName: 'getFeePriceEth',
      },
    ],
  });

  const [
    totalRoundBalanceResponse,
    dataFeedAnswerResponse,
    feePriceEthResponse,
  ] = pricingData ?? [];

  const { result: totalRoundBalance = 0n } = totalRoundBalanceResponse ?? {};
  const { result: dataFeedAnswer = 0n } = dataFeedAnswerResponse ?? {};
  const { result: feePriceEth = 0n } = feePriceEthResponse ?? {};

  const feePriceStr = useMemo(() => {
    const feePrice = formatEther(feePriceEth);

    return feePrice;
  }, [feePriceEth]);

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
        <h4>Round #{roundsCount != null ? roundsCount + 1n : ''}</h4>
      </Box>

      <Box css={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <BoxCard
          dir='column'
          css={{ gap: '8px', '@bp1': { direction: 'row' } }}
        >
          <Box css={{ alignItems: 'center', gap: '6px' }}>
            <Coins color='#ffb000' size={18} />
            <Text as='span' size='sm' css={{ color: '$pinkWhite' }}>
              Prize pool
            </Text>
          </Box>
          <Text size='xl'>{roundPrizePoolEth} ETH</Text>
          <Text as='span' size='xs' css={{ color: '$pinkLight' }}>
            ≈ ${roundPrizePoolUsd} USD
          </Text>
        </BoxCard>
      </Box>

      <InfoBlock>
        <Text size='sm'>Minimum entry: {formattedFeePrice} ETH</Text>
        <Text size='xs' weight='light'>
          Your chance of winning increases with your bid amount. Winner selected
          randomly using Chainlink VRF for provable fairness.
        </Text>
      </InfoBlock>

      <RaffleEnter defaultBidAmount={formattedFeePrice} />
    </Box>
  );
}

export default CurrentRound;
