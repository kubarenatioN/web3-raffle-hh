import { Button, ConnectWalletButton } from '@/shared/ui-kit/Button';
import { formatAddress } from '@/shared/utils/address';
import {
  injected,
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
} from 'wagmi';

interface IProps {
  text?: string;
  textConnected?: string;
  textDisconnected?: string;
}

function ConnectWalletBtn({
  text = 'Connect Wallet',
  textConnected = 'Disconnect Wallet',
}: IProps) {
  const { isConnected, chain, address } = useConnection();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();

  const injectedConnector = connectors.find((c) => c.type === injected.type);

  // console.log(':ConnectWalletBtn called');

  const chainLabel = chain?.name ? `${chain?.name} (${chain?.id})` : null;
  const addressPretty = address ? formatAddress(address) : null;

  const onConnect = () => {
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const onDisconnect = () => {
    disconnect();
  };

  if (isConnected) {
    return (
      <div>
        <div>{chainLabel}</div>
        <div>{addressPretty}</div>
        <Button onClick={onDisconnect}>{textConnected}</Button>
      </div>
    );
  }

  if (injectedConnector) {
    return (
      <ConnectWalletButton onClick={onConnect}>{text}</ConnectWalletButton>
    );
  }

  return null;
}

export default ConnectWalletBtn;
