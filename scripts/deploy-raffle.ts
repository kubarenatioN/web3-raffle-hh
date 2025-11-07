import { network } from 'hardhat';
import MockV3Aggregator from '../ignition/modules/MockV3Aggregator';
import { deployVrfCoordinator } from './mocks/vrf-coordinator';

async function main() {
  const { ethers, ignition, networkName } = await network.connect();

  // console.log('networkName:', networkName);

  const { mockV3Aggregator } = await ignition.deploy(MockV3Aggregator);
  mockV3Aggregator.waitForDeployment();

  const dataFeedAddress = await mockV3Aggregator.getAddress();

  const { vrfCoordinatorMock } = await deployVrfCoordinator();

  const vrfCoordinatorAddress = await vrfCoordinatorMock.getAddress();

  const args = ['10', dataFeedAddress, 120, vrfCoordinatorAddress, '123'];
  const raffle = await ethers.deployContract('Raffle', args);
  await raffle.waitForDeployment();

  return { raffle };
}

main().catch(console.error);
