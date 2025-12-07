import { raffleContract } from '@/shared/config/contracts';
import RaffleHistory from '@/widgets/draws-history/ui/RaffleHistory';
import CurrentRound from '@/widgets/raffle-current-round/ui/CurrentRound';
import Dashboard from '@/widgets/raffle-stats-dashboard/ui/Dashboard';
import { useCallback } from 'react';
import {
  useConnection,
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';

function Raffle() {
  const { address } = useConnection();
  const { writeContract, isPending: pendingWrite } = useWriteContract();

  console.log('-- Raffle Component called');

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

  const pickWinner = useCallback(() => {
    writeContract({
      ...raffleContract,
      functionName: 'pickWinnerByOwner',
      args: [],
    });
  }, [writeContract]);

  // const requestDraw = () => {
  //   console.log('requestDraw');
  // };

  return (
    <div>
      <div>
        <Dashboard />

        <hr />
        <div>
          <CurrentRound />
          <div>Right</div>
          <div>
            <RaffleHistory items={[]} />
          </div>
        </div>

        <hr />
        {address === raffleOwner && (
          <div>
            <button disabled={pendingWrite} onClick={() => pickWinner()}>
              Pick winner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Raffle;
