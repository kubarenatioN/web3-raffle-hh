import { network } from 'hardhat';

const { ethers } = await network.connect();

export async function deployVrfCoordinator() {
  const vrfCoordinatorMock = await ethers.deployContract(
    'VRFCoordinatorV2Mock',
    [100, 100],
  );
  await vrfCoordinatorMock.waitForDeployment();

  return { vrfCoordinatorMock };
}
