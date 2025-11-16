export const CHAINS_CONFIG = {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org',
    accounts: process.env.SEPOLIA_PRIVATE_KEY
      ? [process.env.SEPOLIA_PRIVATE_KEY]
      : [],
    // chainId: 11155111,
    // priceFeed: {
    //   ETH_USD: '',
    // },
    // VRF_COORDINATOR: '',
    // VRF_SUBSCRIPTION_ID: '',
    // VRF_KEY_HASH: '',
  },
  mainnet: {},
};

export const SEPOLIA_CHAINLINK_CONFIG = {
  // Price Feed Aggregator V3 - ETH/USD on Sepolia
  // https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1#sepolia-testnet
  ETH_USD_PRICE_FEED: '0x694AA1769357215DE4FAC081bf1f309aDC325306',

  // VRF Coordinator V2 Plus on Sepolia
  // https://docs.chain.link/vrf/v2-plus/supported-networks#sepolia-testnet
  VRF_COORDINATOR: '0x9Ddf0Ca8180c6A2e8B4F9A21E06E5362A241E63F',

  // VRF Key Hash for Sepolia (you'll need to get this from Chainlink docs)
  // This is a placeholder - get the actual key hash from Chainlink docs
  VRF_KEY_HASH:
    '0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae',

  // Subscription ID - you'll need to create this via Chainlink VRF UI
  // https://vrf.chain.link/
  SUBSCRIPTION_ID: '0', // Replace with your actual subscription ID
};
