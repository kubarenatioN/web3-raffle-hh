import ConnectWalletBtn from '@/shared/ui/ConnectWalletBtn/ConnectWalletBtn';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div>
          <h4 style={{ margin: 0 }}>ETH Raffle</h4>
          <span>Powered by ChainLink VRF</span>
        </div>

        <div>
          <ConnectWalletBtn />
        </div>
      </div>
    </header>
  );
}

export default Header;
