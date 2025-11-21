import type { HardhatUserConfig } from 'hardhat/config';

import hardhatToolboxMochaEthersPlugin from '@nomicfoundation/hardhat-toolbox-mocha-ethers';
import 'dotenv/config';
import { CHAINS_CONFIG } from './networks.config';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    compilers: [
      {
        version: '0.8.28',
      },
      {
        version: '0.8.7',
      },
    ],
  },
  networks: {
    localhost: {
      type: 'edr-simulated',
    },
    sepolia: {
      type: 'http',
      url: CHAINS_CONFIG.sepolia.url,
      accounts: CHAINS_CONFIG.sepolia.accounts,
      chainId: 11155111,
    },
  },
  verify: {
    etherscan: ETHERSCAN_API_KEY
      ? {
          apiKey: ETHERSCAN_API_KEY,
        }
      : undefined,
  },
  chainDescriptors: {
    11155111: {
      name: 'Sepolia',
      blockExplorers: {
        etherscan: {
          url: 'https://sepolia.etherscan.io',
          apiUrl: 'https://api.etherscan.io/v2/api',
        },
      },
    },
  },
};

export default config;
