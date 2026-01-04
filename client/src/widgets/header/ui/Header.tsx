import { Box, IconBox, Text } from '@/shared/ui-kit';
import ConnectWalletBtn from '@/shared/ui/ConnectWalletBtn/ConnectWalletBtn';
import { ExternalLink, Trophy } from 'lucide-react';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Box align='center' gap='sm'>
          <IconBox colorType='pink'>
            <Trophy />
          </IconBox>
          <div>
            <h3 style={{ margin: 0 }}>ETH Raffle</h3>
            <Text as='span' size='sm'>
              Powered by{' '}
              <Text
                as='a'
                size='sm'
                href='https://docs.chain.link/vrf'
                target='_blank'
                rel='noopener noreferrer'
              >
                ChainLink VRF <ExternalLink size={12} />
              </Text>
            </Text>
          </div>
        </Box>

        <div className={styles.connection}>
          <ConnectWalletBtn />
        </div>
      </div>
    </header>
  );
}

export default Header;
