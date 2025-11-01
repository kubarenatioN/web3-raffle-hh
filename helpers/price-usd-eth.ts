import { ethers } from 'ethers';

const ETH_USD_PRICE = 4_000; // approximately
const USD_ETH_PRICE = 1 / ETH_USD_PRICE;

export const priceUsdEth = (usdAmount: number) => {
  const ethAmount = usdAmount * USD_ETH_PRICE;
  return ethers.parseEther(ethAmount.toString());
};
