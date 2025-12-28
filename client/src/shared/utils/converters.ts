export const ethToUsd = (ethAmount: number, ethPrice: bigint) => {
  const decimals = 10n ** 8n;
  const usdPerOneEth = ethPrice / decimals;

  const usdAmount = ethAmount * Number(String(usdPerOneEth));

  return usdAmount;
};
