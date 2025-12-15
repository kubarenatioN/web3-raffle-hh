import { Box } from '@/shared/ui-kit/Box';
import { IconBox } from '@/shared/ui-kit/IconBox';
import { Text } from '@/shared/ui-kit/Typography';
import ConnectWalletBtn from '@/shared/ui/ConnectWalletBtn/ConnectWalletBtn';
import { ExternalLink, Trophy } from 'lucide-react';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Box css={{ gap: 8, alignItems: 'center' }}>
          <IconBox
            bgColor={
              'linear-gradient(142deg, rgb(248 45 255) 0%, rgb(35 46 223) 100%)'
            }
          >
            <Trophy />
          </IconBox>
          <div>
            <h3 style={{ margin: 0 }}>ETH Raffle</h3>
            <Text as='span' size='sm'>
              Powered by{' '}
              <a
                href='https://docs.chain.link/vrf'
                target='_blank'
                rel='noopener noreferrer'
              >
                ChainLink VRF <ExternalLink size={12} />
              </a>
            </Text>
          </div>
        </Box>

        <div>
          <ConnectWalletBtn />
        </div>
      </div>
    </header>
  );
}

export default Header;
