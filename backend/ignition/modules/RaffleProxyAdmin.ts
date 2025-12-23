import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('RaffleProxyAdmin', (m) => {
  const proxyAdmin = m.contract('RaffleProxyAdmin', []);

  return { proxyAdmin };
});
