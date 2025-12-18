import { Box } from '@/shared/ui-kit/Box';
import { IconBox } from '@/shared/ui-kit/IconBox';
import { Text } from '@/shared/ui-kit/Typography';
import { Ticket } from 'lucide-react';
import { useMemo } from 'react';
import { formatEther } from 'viem/utils';
import { useReadContract, useReadContracts } from 'wagmi';
import { raffleContract } from '../../../shared/config/contracts';
import RaffleEnter from '../../raffle-enter/ui/RaffleEnter';

function CurrentRound() {
  const { data: feePriceEthResponse } = useReadContract({
    ...raffleContract,
    functionName: 'getFeePriceEth',
  });

  const { data: [totalRoundBalanceResponse, entranceFeeResponse] = [] } =
    useReadContracts({
      contracts: [
        {
          ...raffleContract,
          functionName: 's_totalBalance',
        },
        {
          ...raffleContract,
          functionName: 's_entranceFee',
        },
      ],
    });

  const { result: totalRoundBalance } = totalRoundBalanceResponse ?? {};
  const { result: entranceFee } = entranceFeeResponse ?? {};

  const feePriceStr = useMemo(() => {
    const res = feePriceEthResponse;
    const feePrice = res ? formatEther(res) : '0';

    return feePrice;
  }, [feePriceEthResponse]);

  const formattedFeePrice = useMemo(() => {
    const [integerPart, decimalPart = '000000'] = feePriceStr.split('.');

    return `${integerPart}.${decimalPart.substring(0, 6)}`;
  }, [feePriceStr]);

  const roundPrizePoolEth = useMemo(() => {
    const balanceStr = totalRoundBalance ? formatEther(totalRoundBalance) : '';
    return balanceStr;
  }, [totalRoundBalance]);

  const roundPrizePoolUsd = useMemo(() => {
    const usdPerEth =
      feePriceEthResponse && entranceFee
        ? (entranceFee * 10n ** 18n) / feePriceEthResponse
        : undefined;

    const totalRoundBalanceWei = (usdPerEth ?? 0n) * (totalRoundBalance ?? 0n);

    return totalRoundBalanceWei;
  }, [totalRoundBalance, entranceFee, feePriceEthResponse]);

  return (
    <Box dir='column' css={{ gap: '1.5rem' }}>
      <Box css={{ gap: '6px', alignItems: 'center' }}>
        <IconBox bgColor='linear-gradient(120deg,rgb(138, 17, 224) 0%,rgb(156, 7, 156) 100%)'>
          <Ticket />
        </IconBox>
        <h4>Round #{1}</h4>
      </Box>

      <Box>
        <Box dir='column' css={{ gap: '6px', '@bp1': { direction: 'row' } }}>
          <Text>
            Prize pool <br /> {roundPrizePoolEth} ETH
          </Text>
          <Text as='span' size='sm'>
            ≈${formatEther(roundPrizePoolUsd)} USD
          </Text>
        </Box>
      </Box>

      <Box dir='column' css={{ gap: '6px' }}>
        <Text>Minimum entry price: {formattedFeePrice} ETH</Text>
        <Text size='sm'>
          Your chance of winning increases with your bid amount. Winner selected
          randomly using Chainlink VRF for provable fairness.
        </Text>
      </Box>

      <RaffleEnter defaultBidAmount={formattedFeePrice} />
    </Box>
  );
}

export default CurrentRound;
