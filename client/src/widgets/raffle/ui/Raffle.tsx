import { raffleContract } from '@/shared/config/contracts';
import { Box, Section, Text } from '@/shared/ui-kit';
import RaffleHistory from '@/widgets/draws-history/ui/RaffleHistory';
import CurrentRound from '@/widgets/raffle-current-round/ui/CurrentRound';
import RaffleParticipants from '@/widgets/raffle-participants/ui/RaffleParticipants';
import Dashboard from '@/widgets/raffle-stats-dashboard/ui/Dashboard';
import { useCallback } from 'react';
import {
  useConnection,
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';
import styles from './Raffle.module.css';

function Raffle() {
  const { address } = useConnection();
  const { writeContract, isPending: pendingWrite } = useWriteContract();

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

  console.log('raffle called');

  return (
    <div className={`Raffle ${styles.wrapper}`}>
      <Box dir='column' css={{ gap: 12 }}>
        <Text as='h1' size='xl' weight='bold'>
          Decentralized Raffle
        </Text>
        <Text>
          Enter the raffle, place your bid, and win ETH! Winner selected fairly
          using Chainlink VRF.
        </Text>
      </Box>

      <Dashboard />

      <div className={styles.grid}>
        <Section>
          <CurrentRound />
        </Section>

        <Section className={styles.participants}>
          <RaffleParticipants />
        </Section>

        <Section>
          <RaffleHistory items={[]} />
        </Section>
      </div>

      {address === raffleOwner && (
        <>
          <hr />
          <div>
            <button disabled={pendingWrite} onClick={() => pickWinner()}>
              Pick winner
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Raffle;
