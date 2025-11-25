import {
  createPublicClient,
  createWalletClient,
  custom,
  getContract,
  http,
} from 'viem';
import { sepolia } from 'viem/chains';
import { useReadContract } from 'wagmi';
import { raffleAbi } from '../../../abi/Raffle.abi';

function Raffle() {
  const { data: raffleOwner } = useReadContract({
    address: '0x912860C6930FbC7c4932eA4aAB8b21C104c6d4B7',
    abi: raffleAbi,
    functionName: 'i_owner',
    args: [],
  });

  console.log('raffleOwner:', raffleOwner);

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  const raffleContract = getContract({
    address: '0x912860C6930FbC7c4932eA4aAB8b21C104c6d4B7',
    abi: raffleAbi,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });

  const enterRaffle = async () => {
    const block = await publicClient.getBlock();
    console.log(block);

    const addresses = await walletClient.getAddresses();
    console.log(addresses);

    const tx = await raffleContract.read.getFeePriceEth();
    console.log('getFeePriceEth:', tx);
  };

  return (
    <div>
      <div>
        <h4>Raffle</h4>
        {raffleOwner && <div>Raffle owner: {raffleOwner}</div>}

        <div>
          <button
            onClick={() => {
              enterRaffle();
            }}
          >
            Enter raffle
          </button>
        </div>
      </div>
    </div>
  );
}

export default Raffle;
