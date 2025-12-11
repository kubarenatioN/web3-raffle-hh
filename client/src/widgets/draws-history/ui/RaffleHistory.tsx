import { raffleAbi } from '@/abi/Raffle.abi';
import { raffleContract } from '@/shared/config/contracts';
import { useEffect, useState } from 'react';
import { decodeEventLog } from 'viem';
import { usePublicClient } from 'wagmi';
import { type IRaffleRoundRecord } from './RaffleRoundRecord';

function RaffleHistory({ items }: { items: IRaffleRoundRecord[] }) {
  const [data, setData] = useState<any[]>([]);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchLogs = async () => {
      const _fromBlock = 9720212n;
      const eventAbi = raffleAbi.find(
        (item) => item.type === 'event' && item.name === 'RaffleWinnerPicked',
      );
      const logs = await publicClient.getLogs({
        address: raffleContract.address,
        event: eventAbi,
        fromBlock: _fromBlock,
        toBlock: _fromBlock + 1000n,
      });

      const data = logs.map((event) => {
        let decoded = null;
        try {
          decoded = decodeEventLog({
            abi: [eventAbi],
            data: event.data,
            topics: event.topics,
          });
        } catch {
          decoded = null;
        }
        if (!decoded) {
          return null;
        }

        return {
          eventName: decoded.eventName,
          data: decoded.args,
          timestamp: Date.now() / 1000,
          txHash: event.transactionHash,
        };
      });

      // console.log('logs:', logs);
      // console.log('data:', data);

      setData(data);
    };

    fetchLogs();
  }, [publicClient]);

  return (
    <div>
      <h3>Draws History</h3>

      <div>
        {data.map((item, i) => (
          <div key={i}>
            {item.eventName}: {item.data.amount} - {item.data.winner} -{' '}
            {item.data.round} -{' '}
            <a
              href={`https://sepolia.etherscan.io/tx/${item.txHash}`}
              target='_blank'
            >
              see tx.
            </a>
          </div>
        ))}
        {/* {items.map((item) => (
          <RaffleRoundRecord key={item.round} data={item} />
        ))} */}
      </div>
    </div>
  );
}

export default RaffleHistory;
