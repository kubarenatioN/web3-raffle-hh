import { injected, useConnect, useConnection, useConnectors, useDisconnect } from 'wagmi';

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

  console.log(':ConnectWalletBtn called');

  const chainLabel = chain?.name ? `${chain?.name} (${chain?.id})` : null;
  const addressPretty = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 5)}`
    : null;

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
        <button onClick={onDisconnect}>{textConnected}</button>
      </div>
    );
  }

  if (injectedConnector) {
    return <button onClick={onConnect}>{text}</button>;
  }

  return null;
}

export default ConnectWalletBtn;
