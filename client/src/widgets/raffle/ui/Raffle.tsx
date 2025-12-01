import { useCallback, useMemo, useState } from 'react';
import { formatEther, parseEther } from 'viem';
import {
  useConnection,
  useReadContract,
  useReadContracts,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';
import { raffleContract } from '../../../shared/config/contracts';

function Raffle() {
  const { address } = useConnection();
  const { writeContract, isPending: pendingWrite } = useWriteContract();
  const [bidAmount, setBidAmount] = useState<number | null>(null);

  const { data: raffleOwner } = useReadContract({
    ...raffleContract,
    functionName: 'i_owner',
    args: [],
  });

  useWatchContractEvent({
    ...raffleContract,
    eventName: 'RaffleWinnerPicked',
    enabled: true,
  });

  const { data: readData } = useReadContracts({
    contracts: [
      {
        ...raffleContract,
        functionName: 'getPlayerSlotsCount',
      },
      {
        ...raffleContract,
        functionName: 'getUniquePlayersCount',
      },
      {
        ...raffleContract,
        functionName: 'getFeePriceEth',
      },
    ],
  });

  const [playersCount, uniquePlayersCount, feePriceEthResponse] =
    readData ?? [];

  // useEffect(() => {
  //   const res = feePriceEthResponse?.result;
  //   const feePrice = res ? formatEther(res) : 0;

  //   setBidAmount(Number(feePrice));
  // }, [feePriceEthResponse]);

  const defaultBidAmount = useMemo(() => {
    const res = feePriceEthResponse?.result;
    const feePrice = res ? formatEther(res) : '';

    return feePrice;
  }, [feePriceEthResponse?.result]);

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

  const pickWinner = () => {
    writeContract({
      ...raffleContract,
      functionName: 'pickWinnerByOwner',
      args: [],
    });
  };

  const requestDraw = () => {
    console.log('requestDraw');
  };

  const changeBidAmount = (value: string) => {
    const _decimal = Number(value);
    if (!Number.isNaN(_decimal)) {
      setBidAmount(_decimal);
    }
  };

  console.log('bidAmount:', bidAmount, defaultBidAmount);

  return (
    <div>
      <div>
        <h4>Raffle</h4>

        <div>
          <div>Players count: {playersCount?.result ?? 0}</div>
          <div>Unique players count: {uniquePlayersCount?.result ?? 0}</div>
        </div>

        <hr />

        {/* <div>Raffle owner: {raffleOwner ?? 'loading...'}</div> */}
        <div>
          <div>Fee price: {feePriceEthResponse?.result} ETH</div>
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
        </div>

        <div>
          <button
            disabled={pendingWrite}
            onClick={() => enterRaffle(String(bidAmount))}
          >
            Enter raffle
          </button>

          {address && address === raffleOwner ? (
            <>
              <button disabled={pendingWrite} onClick={() => pickWinner()}>
                Pick winner
              </button>
            </>
          ) : address && address !== raffleOwner ? (
            <>
              <button disabled={pendingWrite} onClick={() => requestDraw()}>
                Request raffle draw
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Raffle;
