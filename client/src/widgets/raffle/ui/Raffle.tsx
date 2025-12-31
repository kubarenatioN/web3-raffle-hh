import { raffleContract } from '@/shared/config/contracts';
import { Box, SectionWrapper, Text } from '@/shared/ui-kit';
import RaffleHistory from '@/widgets/draws-history/ui/RaffleHistory';
import CurrentRound from '@/widgets/raffle-current-round/ui/CurrentRound';
import RaffleParticipants from '@/widgets/raffle-participants/ui/RaffleParticipants';
import Dashboard from '@/widgets/raffle-stats-dashboard/ui/Dashboard';
import RaffleWithdraw from '@/widgets/raffle-withdraw/ui/RaffleWithdraw';
import { useCallback } from 'react';
import {
  useConnection,
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';
import styles from './Raffle.module.css';

function Raffle() {
  useWatchContractEvent({
    ...raffleContract,
    eventName: 'RaffleWinnerPicked',
    enabled: true,
  });

  const { address } = useConnection();

  // const { data: winnerBalance } = useReadContract({
  //   ...raffleContract,
  //   functionName: 's_winnerBalance',
  //   args: [address!],
  //   query: {
  //     enabled: !!address,
  //   },
  // });

  console.log('Raffle()');

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
        <Box dir='column' css={{ gap: 24 }}>
          <SectionWrapper>
            <CurrentRound />
          </SectionWrapper>

          {address != null && (
            <SectionWrapper
              className={`${styles['withdraw-wrapper']}`}
              css={{ minHeight: 400 }}
            >
              <RaffleWithdraw address={address} />
            </SectionWrapper>
          )}
        </Box>

        <Box className={styles.participants}>
          <SectionWrapper
            css={{
              flex: '1 1 100%',
              maxHeight: '640px',
              position: 'sticky',
              top: 24,
            }}
          >
            <RaffleParticipants />
          </SectionWrapper>
        </Box>

        <SectionWrapper>
          <RaffleHistory items={[]} />
        </SectionWrapper>
      </div>

      <RaffleOwnerControls />
    </div>
  );
}

function RaffleOwnerControls() {
  const { address } = useConnection();

  const { writeContract, isPending: pendingWrite } = useWriteContract();

  const { data: raffleOwner } = useReadContract({
    ...raffleContract,
    functionName: 'i_owner',
    args: [],
  });

  const pickWinner = useCallback(() => {
    writeContract({
      ...raffleContract,
      functionName: 'pickWinnerByOwner',
      args: [],
    });
  }, [writeContract]);

  if (address === raffleOwner) {
    return (
      <>
        <hr />
        <div>
          <button disabled={pendingWrite} onClick={() => pickWinner()}>
            Pick winner
          </button>
        </div>
      </>
    );
  }

  return null;
}

export default Raffle;
