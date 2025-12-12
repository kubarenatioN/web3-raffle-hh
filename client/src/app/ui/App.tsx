import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { WagmiProvider } from 'wagmi';
import { config } from '../../shared/config';
import { Layout } from '../../shared/ui';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Outlet />
        </Layout>
      </QueryClientProvider>
    </WagmiProvider>

    // <>
    //   <header className={styles.header}>
    //     <NavLink to={'/'}>Home</NavLink>
    //     <NavLink to={'/test'}>Test</NavLink>
    //   </header>
    //   <main className={styles.main}>{children}</main>
    //   <footer className={styles.footer}>Footer</footer>
    // </>
  );
}

export default App;
