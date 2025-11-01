import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

// Change this to the actual address of the mockV3Aggregator while developing
const dataFeedAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

export default buildModule('Raffle', (m) => {
  const args = ['10', dataFeedAddress];
  const raffle = m.contract('Raffle', args);

  return { raffle };
});
