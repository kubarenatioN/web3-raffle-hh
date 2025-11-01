import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const ETH_USD_PRICE = 3_800;

export default buildModule('MockV3Aggregator', (m) => {
  const decimals = 8; // see https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306
  const initialAnswer = ETH_USD_PRICE * 10 ** decimals;

  const args = [decimals, initialAnswer];
  const mockV3Aggregator = m.contract('MockV3Aggregator', args);

  return { mockV3Aggregator };
});
