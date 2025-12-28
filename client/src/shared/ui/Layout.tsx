import Header from '@/widgets/header/ui/Header';
import { Box, Text } from '../ui-kit';
import styles from './Layout.module.css';

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <Box className={styles['footer-content']}>
          <Box
            dir='row'
            css={{
              gap: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: '1 1 100%',
            }}
          >
            <Text css={{ fontStyle: 'normal' }}>
              Made by{' '}
              <a
                href='https://github.com/kubarenatioN'
                target='_blank'
                rel='noopener noreferrer'
              >
                Nikita Kubarko
              </a>
            </Text>
            <Text>Powered by ChainLink & TheGraph Protocol</Text>
          </Box>
        </Box>
      </footer>
    </>
  );
}

export default Layout;
