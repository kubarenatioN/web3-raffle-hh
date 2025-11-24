import { network } from 'hardhat';

const { ethers } = await network.connect();

async function main() {
  const [signer, caller] = await ethers.getSigners();

  console.log('signer:', signer);
  console.log('second:', caller);
}

try {
  main();
} catch (error) {
  console.error(error);
}
