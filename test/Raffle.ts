import { expect } from 'chai';
import hre from 'hardhat';
import { Raffle } from '../types/ethers-contracts';

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

async function deployVRFCoordinatorMock() {
  const args = [0, 0, 100]; // for local tests
  const vrfCoordinator = await ethers.deployContract(
    'VRFCoordinatorV2Mock',
    args,
  );

  vrfCoordinator.waitForDeployment();

  return { vrfCoordinator };
}

async function prepareDependencies() {
  const { mockV3Aggregator } = await deployMockV3Aggregator();

  const { vrfCoordinator } = await deployVRFCoordinatorMock();

  const subCreatedFilter = vrfCoordinator.filters.SubscriptionCreated;

  let tx = await vrfCoordinator.createSubscription();
  await tx.wait(1);

  const eventLog = await vrfCoordinator.queryFilter(subCreatedFilter);

  const subId: BigInt = eventLog[0].args[0];

  return { mockV3Aggregator, vrfCoordinator, subId };
}

async function deployRaffleFixture() {
  const { mockV3Aggregator, vrfCoordinator, subId } =
    await prepareDependencies();

  const dataFeedAddress = await mockV3Aggregator.getAddress();
  const vrfCoordinatorAddress = await vrfCoordinator.getAddress();

  const fee = 10; // in USD
  const drawInterval = 12 * 3600; // 12 hours

  const args = [
    fee,
    dataFeedAddress,
    drawInterval,
    vrfCoordinatorAddress,
    subId,
  ];
  const raffle = await ethers.deployContract('Raffle', args);
  await raffle.waitForDeployment();

  const tx = await vrfCoordinator.addConsumer(subId.toString(), raffle);
  await tx.wait(1);

  return { raffle, mockV3Aggregator, subId };
}

async function prepareRaffleToPickWinnerFixture() {
  const { mockV3Aggregator, vrfCoordinator, subId } =
    await prepareDependencies();

  const dataFeedAddress = await mockV3Aggregator.getAddress();
  const vrfCoordinatorAddress = await vrfCoordinator.getAddress();

  const fee = 10; // in USD
  const drawInterval = 12 * 3600; // 12 hours

  const args = [
    fee,
    dataFeedAddress,
    drawInterval,
    vrfCoordinatorAddress,
    subId,
  ];
  const raffle = await ethers.deployContract('Raffle', args);
  await raffle.waitForDeployment();

  const tx = await vrfCoordinator.addConsumer(subId.toString(), raffle);
  await tx.wait(1);

  const vrfCoordinatorMock = await ethers.getContractAt(
    'VRFCoordinatorV2Mock',
    vrfCoordinatorAddress,
  );

  const randomWordsRequestedFilter =
    raffle.filters.RaffleRandomWordsRequested();

  // to inspect subscriptions
  // const subs = await vrfCoordinatorMock.getSubscription(
  //   await raffle.s_subscriptionId(),
  // );
  // console.log('vrfCoordinatorMock subs', subs);

  await enterRaffle(raffle);

  return { raffle, vrfCoordinatorMock, randomWordsRequestedFilter };
}

function deployRaffleFixtureExtra(deployer?: any) {
  return async function _deployRaffleFixtureExtra() {
    const { mockV3Aggregator, vrfCoordinator, subId } =
      await prepareDependencies();

    const dataFeedAddress = await mockV3Aggregator.getAddress();
    const vrfCoordinatorAddress = await vrfCoordinator.getAddress();

    const fee = 10; // in USD
    const drawInterval = 12 * 3600; // 12 hours

    const args = [
      fee,
      dataFeedAddress,
      drawInterval,
      vrfCoordinatorAddress,
      subId,
    ];
    const raffle = await ethers.deployContract('Raffle', args, deployer);
    await raffle.waitForDeployment();

    return { raffle, mockV3Aggregator };
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

      const { raffle } = await networkHelpers.loadFixture(deployRaffleFixture);

      const raffleAddress = await raffle.getAddress();
      const payment = ethers.parseEther('1');

      let tx = await raffle.enter({ value: payment });
      await tx.wait(1);

      expect(tx.to).equals(raffleAddress);
      expect(tx.from).equals(signer);

      const totalBalance = await raffle.s_totalBalance();
      const entrantAddress = await raffle.s_playersList(0);

      expect(totalBalance).to.equal(payment);
      expect(entrantAddress).to.equal(signer);
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

      const totalBalance = await raffle.s_totalBalance();

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

  describe('VRF Coordinator', () => {
    it('should have vrf subscription created', async () => {
      const { raffle } = await networkHelpers.loadFixture(deployRaffleFixture);

      const coordinator = await raffle.s_vrfCoordinator();

      expect(coordinator).to.exist;
    });

    it('should request random words', async () => {
      const { raffle } = await networkHelpers.loadFixture(deployRaffleFixture);

      await enterRaffle(raffle);

      const pickWinnerCall = raffle.pickWinnerByOwner();

      await expect(pickWinnerCall).to.emit(
        raffle,
        'RaffleRandomWordsRequested',
      );
    });

    it('should fulfill random words', async () => {
      const { raffle, vrfCoordinatorMock, randomWordsRequestedFilter } =
        await networkHelpers.loadFixture(prepareRaffleToPickWinnerFixture);

      const raffleAddress = await raffle.getAddress();

      const winnerPicked = new Promise<any>((res, rej) => {
        raffle.once(raffle.filters.RaffleWinnerPicked, (winner, round) => {
          res({ winner, round });
        });
      });

      const pickWinnerTx = await raffle.pickWinnerByOwner();
      await pickWinnerTx.wait(1);

      const wordsReqEvents = await raffle.queryFilter(
        randomWordsRequestedFilter,
      );
      const reqId = wordsReqEvents[0].args[0];

      const fulfillTx = await vrfCoordinatorMock.fulfillRandomWords(
        reqId,
        raffleAddress,
      );
      await fulfillTx.wait(1);

      const [winnerPickedEvent] = await raffle.queryFilter(
        raffle.filters.RaffleWinnerPicked,
      );

      const playersList = await raffle.s_playersList;

      const { winner, round } = await winnerPicked;
      expect(winner).to.exist;
      expect(round).to.equal(0);

      // second approach - better one
      const [winner2, round2] = winnerPickedEvent.args;

      expect(winner2).to.exist;
      expect(round2).to.equal(0);
      expect(playersList.length).to.equal(0);

      // to see if random words were fulfilled
      // const fulfilled = await vrfCoordinatorMock.queryFilter(
      //   vrfCoordinatorMock.filters.RandomWordsFulfilled,
      // );
    });
  });

  describe('Withdrawing funds', () => {
    it('should correct withdraw winner amount', async () => {
      const { raffle, vrfCoordinatorMock, randomWordsRequestedFilter } =
        await networkHelpers.loadFixture(prepareRaffleToPickWinnerFixture);

      const raffleAddress = await raffle.getAddress();

      const pickWinnerTx = await raffle.pickWinnerByOwner();
      await pickWinnerTx.wait(1);

      const wordsReqEvents = await raffle.queryFilter(
        randomWordsRequestedFilter,
      );
      const reqId = wordsReqEvents[0].args[0];

      const fulfillTx = await vrfCoordinatorMock.fulfillRandomWords(
        reqId,
        raffleAddress,
      );
      await fulfillTx.wait(1);

      const [winnerPickedEvent] = await raffle.queryFilter(
        raffle.filters.RaffleWinnerPicked,
      );

      const [winner] = winnerPickedEvent.args;

      const amountToWithdraw = ethers.parseEther('0.5');

      const raffleBalanceBefore =
        await ethers.provider.getBalance(raffleAddress);

      const ownerCommission = await raffle.s_ownerCommission();

      const winnerAmountBefore = await raffle.s_winnerBalance(winner);

      const winnerSig = await ethers.getSigner(winner);
      const withdrawTx = await raffle
        .connect(winnerSig)
        .withdraw(amountToWithdraw);

      const winnerAmountAfter = await raffle.s_winnerBalance(winner);
      const raffleBalanceAfter =
        await ethers.provider.getBalance(raffleAddress);

      const remainingAmount = winnerAmountBefore - amountToWithdraw;
      const remainingRaffleBalance = raffleBalanceBefore - amountToWithdraw;

      expect(withdrawTx)
        .to.emit(raffle, 'RaffleWinnerFundsSent')
        .withArgs(winner, amountToWithdraw);
      expect(winnerAmountAfter).to.eq(remainingAmount);
      expect(raffleBalanceAfter).to.eq(remainingRaffleBalance);

      await expect(
        raffle.connect(winnerSig).withdraw(ethers.parseEther('2')),
      ).to.revertedWithCustomError(raffle, 'Raffle__TooMuchWithdrawAmount');

      // test 20% commission to owner
      expect(ownerCommission).to.eq((raffleBalanceBefore * 20n) / 100n);

      const raffleOwner = await raffle.i_owner();
      const ownerWithdrawTx = await raffle.withdrawOwner();

      expect(ownerWithdrawTx)
        .to.emit(raffle, 'RaffleOwnerFundsSent')
        .withArgs(raffleOwner, ownerCommission);
    });
  });
});

async function enterRaffle(raffle: Raffle) {
  const [, caller] = await ethers.getSigners();

  let tx = await raffle.enter({ value: ethers.parseEther('0.5') });
  await tx.wait(1);

  tx = await raffle.enter({ value: ethers.parseEther('0.5') });
  await tx.wait(1);

  tx = await raffle.connect(caller).enter({ value: ethers.parseEther('1.5') });
  await tx.wait(1);
}
