import { network } from 'hardhat';
import MockV3Aggregator from '../ignition/modules/MockV3Aggregator';
import { CHAINS_CONFIG } from '../networks.config';
import { deployVrfCoordinator } from './mocks/vrf-coordinator';

const { ethers, ignition, networkName, networkConfig } =
  await network.connect();

async function main() {
  // console.log('networkName:', networkName);
  const isLocalNetwork = networkName === 'localhost';

  let dataFeed = ''; // address
  let vrfCoordinator = ''; // address
  let subscriptionId = ''; // uint256
  let enterFeePriceUsd = 10;
  let drawInterval = 120; // seconds

  if (isLocalNetwork) {
    const { mockV3Aggregator, vrfCoordinatorMock } = await prepareMocks();

    const dataFeedAddress = await mockV3Aggregator.getAddress();
    const vrfCoordinatorAddress = await vrfCoordinatorMock.getAddress();

    dataFeed = dataFeedAddress;
    vrfCoordinator = vrfCoordinatorAddress;
  } else {
    // Testnet info
    if (networkName === 'sepolia') {
      const config = CHAINS_CONFIG.sepolia;
      dataFeed = '';
      vrfCoordinator = '';
      subscriptionId = '';
    } else {
      throw new Error('Network is not configured');
    }
  }

  const args = [
    enterFeePriceUsd.toString(),
    dataFeed,
    drawInterval,
    vrfCoordinator,
    subscriptionId,
  ];
  const raffle = await ethers.deployContract('Raffle', args);
  await raffle.waitForDeployment();

  return { raffle };
}

main().catch(console.error);

async function prepareMocks() {
  const { mockV3Aggregator } = await ignition.deploy(MockV3Aggregator);
  mockV3Aggregator.waitForDeployment();

  const { vrfCoordinatorMock } = await deployVrfCoordinator();

  return { mockV3Aggregator, vrfCoordinatorMock };
}
