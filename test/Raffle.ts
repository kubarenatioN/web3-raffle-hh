import { expect } from 'chai';
import { Signer } from 'ethers/providers';
import hre from 'hardhat';

const { ethers, networkConfig, networkName, networkHelpers } =
  await hre.network.connect();

async function deployMockV3Aggregator() {
  const initialAnswer = 3_800n * 10n ** 8n; // add 8 decimals to actual ETH price
  const mockV3Aggregator = await ethers.deployContract('MockV3Aggregator', [
    8,
    initialAnswer,
  ]);
  await mockV3Aggregator.waitForDeployment();

  return { mockV3Aggregator };
}

async function deployRaffleFixture() {
  const { mockV3Aggregator } = await deployMockV3Aggregator();
  const dataFeedAddress = await mockV3Aggregator.getAddress();

  const fee = 10; // in USD
  const drawInterval = 12 * 3600; // 12 hours
  const args = [fee, dataFeedAddress, drawInterval];
  const raffle = await ethers.deployContract('Raffle', args);
  await raffle.waitForDeployment();

  return { raffle, mockV3Aggregator };
}

function deployRaffleFixtureExtra(deployer?: Signer) {
  return async function _deployRaffleFixtureExtra() {
    const { mockV3Aggregator } = await deployMockV3Aggregator();
    const dataFeedAddress = await mockV3Aggregator.getAddress();

    const fee = 10; // in USD
    const drawInterval = 12 * 3600; // 12 hours
    const args = [fee, dataFeedAddress, drawInterval];

    const raffle = await ethers.deployContract('Raffle', args, deployer);
    await raffle.waitForDeployment();

    return { raffle };
  };
}

describe('Raffle', () => {
  it('should deploy', async () => {
    const { raffle } = await networkHelpers.loadFixture(deployRaffleFixture);

    expect(raffle).to.exist;
  });

  it('should have initial total balance', async () => {
    const { raffle } = await networkHelpers.loadFixture(deployRaffleFixture);

    const totalBalance = await raffle.s_totalBalance();

    expect(totalBalance.toString()).to.equal('0');
  });

  it('should set correct entrance fee when deployed', async () => {
    const { raffle } = await networkHelpers.loadFixture(deployRaffleFixture);

    const entranceFee = await raffle.s_entranceFee();

    expect(entranceFee.toString()).to.equal('10');
  });

  it('should have correct getFeePriceEth() computations', async () => {
    const { raffle, mockV3Aggregator } =
      await networkHelpers.loadFixture(deployRaffleFixture);

    const entranceFeeUsd = await raffle.s_entranceFee();

    const onchainAnswer = await mockV3Aggregator.latestAnswer();
    const feePrice = await raffle.getFeePriceEth();

    const expectedAnswer = 3_800 * 10 ** 8;

    const scale = 10n ** (18n + 8n);
    const expectedFeePrice = entranceFeeUsd * (scale / onchainAnswer);

    expect(onchainAnswer).to.equal(expectedAnswer);
    expect(feePrice).to.equal(expectedFeePrice);
  });

  it('should allow owner update entrance fee', async () => {
    const [, caller] = await ethers.getSigners();

    const { raffle } = await networkHelpers.loadFixture(deployRaffleFixture);

    const entranceFee = await raffle.s_entranceFee();

    expect(entranceFee.toString()).to.equal('10');

    const newFee = '20';
    await raffle.updateEntranceFee(newFee);

    const newEntranceFee = await raffle.s_entranceFee();

    expect(newEntranceFee).to.equal(newFee);

    const updateFeeCall = raffle.connect(caller).updateEntranceFee('30');

    await expect(updateFeeCall)
      .to.revertedWithCustomError(raffle, 'Raffle__OnlyOwner')
      .withArgs(caller.address);
  });

  it('should set correct owner address', async () => {
    const [first, deployer] = await ethers.getSigners();
    const { raffle } = await networkHelpers.loadFixture(
      deployRaffleFixtureExtra(deployer),
    );

    const owner = await raffle.i_owner();

    expect(owner).to.not.equal(first.address);
    expect(owner).to.equal(deployer.address);
  });

  describe('Entering Raffle', () => {
    it('should allow enter the raffle', async () => {
      const [signer] = await ethers.getSigners();

      const { raffle, mockV3Aggregator } =
        await networkHelpers.loadFixture(deployRaffleFixture);

      const raffleAddress = await raffle.getAddress();
      const payment = ethers.parseEther('1');

      let tx = await raffle.enter({ value: payment });
      await tx.wait(1);

      expect(tx.to).equals(raffleAddress);
      expect(tx.from).equals(signer);

      const signerBalance = await raffle.s_playersMap(signer.address);

      expect(signerBalance).to.equal(payment);
    });

    it('should set correct balances of entrants', async () => {
      const [signer, secondAcc] = await ethers.getSigners();

      const entrancePayment = ethers.parseEther('1');

      const { raffle } = await networkHelpers.loadFixture(deployRaffleFixture);

      let tx = await raffle.enter.send({ value: entrancePayment });
      await tx.wait(1);

      const secondAccPayment = ethers.parseEther('1.5');
      tx = await raffle.connect(secondAcc).enter({
        value: secondAccPayment,
      });
      await tx.wait(1);

      const signerBalance = await raffle.s_playersMap(signer.address);
      const secondBalance = await raffle.s_playersMap(secondAcc.address);

      const totalBalance = await raffle.s_totalBalance();

      expect(signerBalance).to.equal(entrancePayment);
      expect(secondBalance).to.equal(secondAccPayment);
      expect(totalBalance).to.equal(ethers.parseEther(`${1 + 1.5}`));
    });

    it('should validate entering fee', async () => {
      const { raffle } = await networkHelpers.loadFixture(deployRaffleFixture);

      let payment = ethers.parseEther('0.001');
      const feePrice = await raffle.getFeePriceEth();

      let tx = raffle.enter({ value: payment.toString() });

      await expect(tx).to.revertedWithCustomError(
        raffle,
        'Raffle__NotEnoughFeeSent',
      );

      payment = feePrice - 1n; // subtract 1 Wei from fee price
      tx = raffle.enter({ value: payment.toString() });

      await expect(tx).to.revertedWithCustomError(
        raffle,
        'Raffle__NotEnoughFeeSent',
      );
    });
  });
});
