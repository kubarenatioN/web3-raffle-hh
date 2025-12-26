import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('RaffleUpgradeable', (m) => {
  const raffle = m.contract('Raffle', []);

  return { raffle };
});
