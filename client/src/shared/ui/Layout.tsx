import Header from '@/widgets/header/ui/Header';
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
        <div className={styles['footer-content']}>
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
        </div>
      </footer>
    </>
  );
}

export default Layout;
