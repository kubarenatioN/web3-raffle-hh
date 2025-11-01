import { network } from 'hardhat';
import MockV3Aggregator from '../ignition/modules/MockV3Aggregator';

async function main() {
  const { ethers, ignition, networkName } = await network.connect();

  // console.log('networkName:', networkName);

  const { mockV3Aggregator } = await ignition.deploy(MockV3Aggregator);
  mockV3Aggregator.waitForDeployment();

  const dataFeedAddress = await mockV3Aggregator.getAddress();

  const args = ['10', dataFeedAddress];
  const raffle = await ethers.deployContract('Raffle', args);
  await raffle.waitForDeployment();

  return { raffle };
}

main().catch(console.error);
