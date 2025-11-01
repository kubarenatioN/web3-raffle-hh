import type { HardhatUserConfig } from 'hardhat/config';

import hardhatToolboxMochaEthersPlugin from '@nomicfoundation/hardhat-toolbox-mocha-ethers';

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
  networks: {},
};

export default config;
