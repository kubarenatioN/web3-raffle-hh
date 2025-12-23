import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('RaffleProxy', (m) => {
  const proxy = m.contract('RaffleProxy', []);

  return { proxy };
});
