import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { ethers } from 'ethers';
import MockV3Aggregator from './MockV3Aggregator';
import VRFCoordinatorV2Mock from './VRFCoordinatorV2Mock';

export default buildModule('RaffleLocal', (m) => {
  const { mockV3Aggregator } = m.useModule(MockV3Aggregator);

  const { vrfCoordinatorMock } = m.useModule(VRFCoordinatorV2Mock);

  // for local dev - create subscription and extract ID from event
  const createSubCall = m.call(vrfCoordinatorMock, 'createSubscription', []);
  const subscriptionId = m.readEventArgument(
    createSubCall,
    'SubscriptionCreated',
    'subId',
    {
      emitter: vrfCoordinatorMock,
    },
  );

  const args = [
    '10',
    mockV3Aggregator,
    120,
    vrfCoordinatorMock,
    subscriptionId,
  ];
  const raffle = m.contract('Raffle', args);

  // Add raffle contract as a consumer to the subscription
  const addConsumerFuture = m.call(vrfCoordinatorMock, 'addConsumer', [
    subscriptionId,
    raffle,
  ]);

  m.call(
    vrfCoordinatorMock,
    'fundSubscription',
    [subscriptionId, ethers.parseEther('1')],
    {
      after: [addConsumerFuture],
    },
  );

  return { raffle };
});
