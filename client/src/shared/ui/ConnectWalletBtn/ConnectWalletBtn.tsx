import { Box, Text } from '@/shared/ui-kit';
import { Button, ConnectWalletButton } from '@/shared/ui-kit/Button';
import { formatAddress } from '@/shared/utils/address';
import { useConnect, useConnection, useConnectors, useDisconnect } from 'wagmi';
import { injected, metaMask } from 'wagmi/connectors';

interface IProps {
  text?: string;
  textConnected?: string;
  textDisconnected?: string;
}

function ConnectWalletBtn({ text = 'Connect Wallet' }: IProps) {
  const { isConnected, chain, address = '0x..' } = useConnection();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();

  let injectedConnector = connectors.find((c) => c.type === metaMask.type);

  if (!injectedConnector) {
    injectedConnector = connectors.find((c) => c.type === injected.type);
  }

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
      <Box css={{ alignItems: 'center', gap: '12px' }}>
        <Box dir='row' css={{ alignItems: 'baseline', gap: 4 }}>
          <Text size='sm' css={{ color: '$pink-100' }}>
            chain:
          </Text>
          <Text size='sm' css={{ fontFamily: 'monospace' }}>
            {chainLabel}
          </Text>
        </Box>
        <Button
          onClick={onDisconnect}
          css={{
            background: '#45007533',
            border: '1px solid',
            borderColor: '$pink400',
            color: '$pink400',
          }}
          title='Disconnect Wallet'
        >
          <Text as='span'>{addressPretty}</Text>
        </Button>
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
