import { expect } from 'chai';
import hre from 'hardhat';

const { ethers, networkConfig, networkName } = await hre.network.connect();

describe('Raffle', () => {
  it('should deploy', async () => {
    const raffle = await ethers.deployContract('Raffle', [0]);
    await raffle.waitForDeployment();

    expect(raffle).to.exist;
  });

  it('should have initial total balance', async () => {
    const fee = ethers.parseEther('0.02');
    const raffle = await ethers.deployContract('Raffle', [fee]);
    await raffle.waitForDeployment();

    const totalBalance = await raffle.s_totalBalance();

    expect(totalBalance.toString()).to.equal('0');
  });

  it('should set correct entrance fee when deployed', async () => {
    const fee = ethers.parseEther('0.02');
    const raffle = await ethers.deployContract('Raffle', [fee]);
    await raffle.waitForDeployment();

    const entranceFee = await raffle.s_entranceFee();

    expect(entranceFee.toString()).to.equal(fee);
  });

  it('should allow owner update entrance fee', async () => {
    const [, caller] = await ethers.getSigners();
    let fee = ethers.parseEther('0.02');
    const raffle = await ethers.deployContract('Raffle', [fee]);
    await raffle.waitForDeployment();

    const entranceFee = await raffle.s_entranceFee();

    expect(entranceFee.toString()).to.equal(fee);

    fee = ethers.parseEther('0.05');
    await raffle.updateEntranceFee(fee);

    const newEntranceFee = await raffle.s_entranceFee();

    expect(newEntranceFee.toString()).to.equal(fee);

    const updateFeeCall = raffle.connect(caller).updateEntranceFee(fee);

    await expect(updateFeeCall)
      .to.revertedWithCustomError(raffle, 'Raffle__OnlyOwner')
      .withArgs(caller.address);
  });

  it('should set correct owner address', async () => {
    const [first, deployer] = await ethers.getSigners();
    const raffle = await ethers.deployContract(
      'Raffle',
      [ethers.parseEther('0.05')],
      deployer,
    );
    await raffle.waitForDeployment();

    const owner = await raffle.i_owner();

    expect(owner).to.not.equal(first.address);
    expect(owner).to.equal(deployer.address);
  });

  it('should allow enter the raffle', async () => {
    const [signer] = await ethers.getSigners();

    const entranceFee = ethers.parseEther('1');
    const raffleArgs = [entranceFee.toString()];
    const raffle = await ethers.deployContract('Raffle', raffleArgs);
    await raffle.waitForDeployment();

    const raffleAddress = await raffle.getAddress();

    let tx = await raffle.enter({ value: entranceFee.toString() });
    await tx.wait(1);

    expect(tx.to).equals(raffleAddress);
    expect(tx.from).equals(signer);

    const signerBalance = await raffle.s_playersMap(signer.address);

    expect(signerBalance.toString()).to.equal(entranceFee);
  });

  it('should set correct balances of entrants', async () => {
    const [signer, secondAcc] = await ethers.getSigners();

    const entranceFee = ethers.parseEther('1');
    const raffleArgs = [entranceFee.toString()];
    const raffle = await ethers.deployContract('Raffle', raffleArgs);
    await raffle.waitForDeployment();

    const raffleAddress = await raffle.getAddress();

    let tx = await raffle.enter.send({ value: entranceFee.toString() });
    await tx.wait(1);

    expect(tx.to).equals(raffleAddress);
    expect(tx.from).equals(signer);

    const secondAccEntrance = ethers.parseEther('1.5').toString();
    tx = await raffle.connect(secondAcc).enter({
      value: secondAccEntrance,
    });
    await tx.wait(1);

    const signerBalance = await raffle.s_playersMap(signer.address);
    const secondBalance = await raffle.s_playersMap(secondAcc.address);

    expect(signerBalance.toString()).to.equal(entranceFee);
    expect(secondBalance.toString()).to.equal(secondAccEntrance);
  });
});
