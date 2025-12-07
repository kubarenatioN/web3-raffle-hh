import { useMemo } from 'react';
import { formatEther } from 'viem/utils';
import { useReadContract } from 'wagmi';
import { raffleContract } from '../../../shared/config/contracts';
import RaffleEnter from '../../raffle-enter/ui/RaffleEnter';

function CurrentRound() {
  const { data: feePriceEthResponse } = useReadContract({
    ...raffleContract,
    functionName: 'getFeePriceEth',
  });

  const feePrice = useMemo(() => {
    const res = feePriceEthResponse;
    const feePrice = res ? formatEther(res) : '0';

    return feePrice;
  }, [feePriceEthResponse]);

  const formattedFeePrice = useMemo(() => {
    const [integerPart, decimalPart = '000000'] = feePrice.split('.');

    return `${integerPart}.${decimalPart.substring(0, 6)}`;
  }, [feePrice]);

  return (
    <>
      <div>
        <p>Minimum entry price: {formattedFeePrice} ETH</p>
      </div>

      <RaffleEnter defaultBidAmount={formattedFeePrice} />
    </>
  );
}

export default CurrentRound;
