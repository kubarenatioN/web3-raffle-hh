import { network } from 'hardhat';

async function main() {
  const { ethers, ignition, networkName } = await network.connect();

  const addr = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0';
  const raffle = await ethers.getContractAt('Raffle', addr);

  const feePrice = ethers.parseEther('0.01'); // passes fee
  // const feePrice = ethers.parseEther('0.001'); // not passes fee ~$3.87

  let tx = await raffle.enter({ value: feePrice });
  await tx.wait(1);
}

main().catch(console.error);
