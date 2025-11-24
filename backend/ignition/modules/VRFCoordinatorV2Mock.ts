import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('VRFCoordinatorV2Mock', (m) => {
  // VRFCoordinatorV2_5Mock constructor: (uint96 _baseFee, uint96 _gasPrice, int256 _weiPerUnitLink)
  // For local testing: [0, 0, 0] means no payment required
  const vrfCoordinatorMock = m.contract('VRFCoordinatorV2Mock', [0, 0, 0]);

  return { vrfCoordinatorMock };
});
