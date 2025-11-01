import { network } from 'hardhat';

const { ethers, networkName, networkConfig } =
  await network.connect('localhost');

async function main() {
  console.log('network:', networkName);

  const [deployer, caller] = await ethers.getSigners();

  const mockDataFeedContract = await ethers.deployContract(
    'MockV3Aggregator',
    [18, ethers.parseEther('0.01')],
    deployer,
  );
  await mockDataFeedContract.waitForDeployment();
}

try {
  main();
} catch (error) {
  console.error(error);
}

async function logBalance(address: string) {
  let balance = await ethers.provider.getBalance(address);
  console.log('balance:', balance);
}
