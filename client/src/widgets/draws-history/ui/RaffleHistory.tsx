import { raffleContract } from '@/shared/config/contracts';
import { useEffect, useState } from 'react';
import { decodeEventLog, parseAbiItem } from 'viem';
import { usePublicClient } from 'wagmi';
import { type IRaffleRoundRecord } from './RaffleRoundRecord';

function RaffleHistory({ items }: { items: IRaffleRoundRecord[] }) {
  const [data, setData] = useState<any[]>([]);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchLogs = async () => {
      const _fromBlock = 9720212n;
      const logs = await publicClient.getLogs({
        address: raffleContract.address,
        // event: raffleAbi.find(
        //   (item) => item.type === 'event' && item.name === 'RaffleWinnerPicked',
        // ),
        fromBlock: _fromBlock,
        toBlock: _fromBlock + 1000n,
      });

      const eventsAbi = [
        parseAbiItem(
          'event RaffleRandomWordsRequested(uint256 indexed reqId, uint256 round)',
        ),
        parseAbiItem('event RaffleWinnerPicked(address winner, uint256 round)'),
        parseAbiItem(
          'event RaffleEntered(address indexed sender, uint256 amount)',
        ),
      ];
      const data = logs.map((event) => {
        const decoded = decodeEventLog({
          abi: eventsAbi,
          data: event.data,
          topics: event.topics,
        });

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
