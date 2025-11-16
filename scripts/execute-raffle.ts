import { network } from 'hardhat';
import RaffleLocal from '../ignition/modules/Raffle.local';

const { ethers, ignition, networkName } = await network.connect();

async function main() {
  const [deployer, second] = await ethers.getSigners();

  const addr = '0x8a791620dd6260079bf849dc5567adc3f2fdc318';
  const raffle = await ethers.getContractAt('Raffle', addr);

  const feePrice = ethers.parseEther('0.01'); // passes fee
  // const feePrice = ethers.parseEther('0.001'); // not passes fee ~$3.87

  let tx = await raffle.enter({ value: feePrice });
  await tx.wait(1);

  tx = await raffle.connect(second).enter({ value: feePrice });
  await tx.wait(1);

  tx = await raffle.pickWinnerByOwner();
}

async function main2() {
  const { raffle: raffleBase } = await ignition.deploy(RaffleLocal);

  // Get the typed contract by getting the address and using getContractAt
  const raffleAddress = await raffleBase.getAddress();
  const raffle = await ethers.getContractAt('Raffle', raffleAddress);

  console.log('raffleAddress:', raffleAddress);

  const [deployer, second] = await ethers.getSigners();

  const feePrice = ethers.parseEther('0.01'); // passes fee
  // const feePrice = ethers.parseEther('0.001'); // not passes fee ~$3.87

  let tx = await raffle.enter({ value: feePrice });
  await tx.wait(1);

  tx = await raffle.connect(second).enter({ value: feePrice });
  await tx.wait(1);

  tx = await raffle.pickWinnerByOwner();
}

main2().catch(console.error);
// main().catch(console.error);
