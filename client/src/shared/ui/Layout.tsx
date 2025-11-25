import { useConnection, useDisconnect } from 'wagmi';
import styles from './Layout.module.css';

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { chain, address } = useConnection();
  const { disconnect } = useDisconnect();

  const addressPretty = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 5)}`
    : null;

  return (
    <>
      <header className={styles.header}>
        <div>
          <h4 style={{ margin: 0 }}></h4>
        </div>

        <div>
          {chain && (
            <div>
              <span>
                Chain: {chain.name} ({chain.id})
              </span>
            </div>
          )}
          {addressPretty && (
            <>
              <div>
                <span>{addressPretty ? addressPretty : '-'}</span>
                <button
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>
          Made by{' '}
          <a
            href='https://github.com/kubarenatioN'
            target='_blank'
            rel='noopener noreferrer'
          >
            Nikita Kubarko
          </a>
        </p>
      </footer>
    </>
  );
}

export default Layout;
