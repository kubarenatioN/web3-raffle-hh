import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const ETH_USD_SEPOLIA_PRICE_FEED = '0x694AA1769357215DE4FAC081bf1f309aDC325306';
const VRF_COORDINATOR_SEPOLIA = '0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B';
const VRF_SUB_ID_SEPOLIA =
  '50035700052798166475670216671852621529237252777743009115022297327204454668481';

export default buildModule('Raffle', (m) => {
  const entranceFee = 5; // in USD
  const drawInterval = 60 * 3; // in seconds

  const args = [
    entranceFee,
    ETH_USD_SEPOLIA_PRICE_FEED,
    drawInterval,
    VRF_COORDINATOR_SEPOLIA,
    VRF_SUB_ID_SEPOLIA,
  ];
  const raffle = m.contract('Raffle', args);

  return { raffle };
});
