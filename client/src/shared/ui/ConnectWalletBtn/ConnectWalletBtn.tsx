import { Box, Text } from '@/shared/ui-kit';
import { Button, ConnectWalletButton } from '@/shared/ui-kit/Button';
import { formatAddress } from '@/shared/utils/address';
import { useConnect, useConnection, useConnectors, useDisconnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

interface IProps {
  text?: string;
  textConnected?: string;
  textDisconnected?: string;
}

function ConnectWalletBtn({ text = 'Connect with MetaMask' }: IProps) {
  const { chain, address } = useConnection();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();

  const connectorsMap = new Map(connectors.map((c) => [c.type, c]));

  // console.log(connectors);

  const connector = connectorsMap.get(metaMask.type);
  // if (!connector) {
  //   connector = connectorsMap.get(injected.type);
  // }

  const chainLabel = `${chain?.name}`;

  const onConnect = () => {
    if (connector) {
      connect({ connector });
    }
  };

  const onDisconnect = () => {
    disconnect();
  };

  if (address) {
    return (
      <Box align='center' gap='md'>
        <Box align='baseline' gap='xs'>
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
            borderColor: '$pink-400',
            color: '$pink-400',
          }}
          title='Disconnect Wallet'
        >
          <Text as='span'>{formatAddress(address)}</Text>
        </Button>
      </Box>
    );
  }

  if (connector) {
    return (
      <ConnectWalletButton onClick={onConnect}>{text}</ConnectWalletButton>
    );
  }

  return <div>No connector found</div>;
}

export default ConnectWalletBtn;
