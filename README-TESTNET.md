# Testnet Setup Guide

## Getting Your Private Key

### Option 1: Create a New Test Wallet (Recommended for Testnet)

1. **Using MetaMask:**
   - Create a new account in MetaMask
   - Go to Account Details → Show Private Key
   - Copy the private key (it will start with `0x`)
   - **Only use this for testnet! Never use mainnet private keys**

2. **Using Hardhat:**

   ```bash
   # Generate a new random private key
   node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Using a script:**
   ```bash
   npx hardhat node  # This will show test accounts with private keys
   ```

### Option 2: Use Existing Wallet (Less Secure)

If you have a wallet you use for testing:

- Export the private key from your wallet
- **Warning:** Only use testnet wallets, never mainnet!

## Setting Up Environment Variables

1. **Copy the example file:**

   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file:**

   ```bash
   SEPOLIA_PRIVATE_KEY=0x1234567890abcdef...  # Your private key (with 0x prefix)
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   ```

3. **Verify `.env` is in `.gitignore`** (it should be already)

## Using Alchemy RPC URL

### Step 1: Get Alchemy API Key

1. Go to [Alchemy.com](https://www.alchemy.com/)
2. Sign up for a free account
3. Create a new app:
   - Network: Ethereum
   - Chain: Sepolia
4. Copy your API key from the dashboard

### Step 2: Use Alchemy URL

Your Alchemy RPC URL will look like:

```
https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

Set it in your `.env`:

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

### Benefits of Alchemy:

- ✅ Higher rate limits (free tier: 300M compute units/month)
- ✅ More reliable than public RPCs
- ✅ Better performance
- ✅ Access to Alchemy's enhanced APIs

### Alternative: Public RPC (Free, but rate-limited)

```bash
SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

## Getting Testnet ETH

1. **Sepolia ETH Faucets:**
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Chainlink Faucet](https://faucets.chain.link/sepolia)
   - [PoW Faucet](https://sepolia-faucet.pk910.de/)

2. **Request testnet ETH** to your wallet address

## Getting Testnet LINK (for VRF)

1. **Chainlink Faucet:**
   - [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)
   - Request LINK tokens

2. **Fund your VRF subscription:**
   - Go to [VRF Portal](https://vrf.chain.link/)
   - Create a subscription
   - Fund it with LINK tokens

## Security Best Practices

1. ✅ **Never commit `.env` file** (already in `.gitignore`)
2. ✅ **Use separate wallets** for testnet and mainnet
3. ✅ **Never share private keys** publicly
4. ✅ **Use environment variables**, not hardcoded keys
5. ✅ **Rotate keys** if accidentally exposed

## Testing Your Setup

```bash
# Test connection to Sepolia
npx hardhat run scripts/deploy-raffle.ts --network sepolia
```

If you see errors about insufficient funds, you need more Sepolia ETH.
