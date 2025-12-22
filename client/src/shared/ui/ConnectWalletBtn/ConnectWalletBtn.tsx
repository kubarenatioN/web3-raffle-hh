import { Box, Text } from '@/shared/ui-kit';
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
  const { isConnected, chain, address = '0x..' } = useConnection();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();

  const injectedConnector = connectors.find((c) => c.type === injected.type);

  // console.log(':ConnectWalletBtn called');

  const chainLabel = `${chain?.name}`;
  const addressPretty = formatAddress(address);

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
      <Box css={{ gap: '8px' }}>
        <Button onClick={onDisconnect}>{textConnected}</Button>
        <Box dir='column' css={{ gap: '2px' }}>
          <Text>{addressPretty}</Text>
          <Text size='sm'>{chainLabel}</Text>
        </Box>
      </Box>
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
