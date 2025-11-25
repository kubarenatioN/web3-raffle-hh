import { useConnection } from 'wagmi';
import Connection from '../../../widgets/connection/ui/Connection';
import Raffle from '../../../widgets/raffle/ui/Raffle';

function Home() {
  const { isConnected, isDisconnected } = useConnection();

  return (
    <>
      {isDisconnected && <Connection />}
      {isConnected && <Raffle />}
    </>
  );
}

export default Home;
