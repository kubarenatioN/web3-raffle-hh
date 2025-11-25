import {
  injected,
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
} from 'wagmi';

function Connection() {
  const connectors = useConnectors();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, isDisconnected } = useConnection();

  const injectedConnector = connectors.find((c) => c.type === injected.type);

  console.log('connection');

  return (
    <>
      {isDisconnected && injectedConnector && (
        <>
          <div>
            <h4>Connect wallet</h4>
            <button
              onClick={() => {
                connect({ connector: injectedConnector });
              }}
            >
              Connect wallet
            </button>
          </div>
        </>
      )}

      {isConnected && (
        <div>
          <h4>You are connected</h4>

          <button
            onClick={() => {
              disconnect();
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </>
  );
}

export default Connection;
