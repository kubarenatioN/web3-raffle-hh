import Header from '@/widgets/header/ui/Header';
import styles from './Layout.module.css';

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  console.log('Layout called');

  return (
    <>
      <Header />

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
