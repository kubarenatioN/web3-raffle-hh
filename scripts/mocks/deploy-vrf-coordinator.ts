import { network } from 'hardhat';

const { ethers, networkName, networkConfig } = await network.connect();

async function main() {
  console.log('network:', networkName);

  const vrfCoordinatorMock = await ethers.deployContract(
    'VRFCoordinatorV2Mock',
    [100, 100],
  );
  await vrfCoordinatorMock.waitForDeployment();

  const addr = await vrfCoordinatorMock.getAddress();
  // console.log(addr);
}

main().catch(console.error);
