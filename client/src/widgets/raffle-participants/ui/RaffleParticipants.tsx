import { raffleAbi } from '@/abi/Raffle.abi';
import { raffleContract } from '@/shared/config/contracts';
import { useEffect, useState } from 'react';
import { decodeEventLog, formatEther } from 'viem/utils';
import { usePublicClient } from 'wagmi';

function RaffleParticipants() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchLogs = async () => {
      const _fromBlock = 9720212n;
      const eventAbi = raffleAbi.find(
        (item) => item.type === 'event' && item.name === 'RaffleEntered',
      );
      const logs = await publicClient.getLogs({
        address: raffleContract.address,
        event: eventAbi,
        fromBlock: _fromBlock,
        toBlock: _fromBlock + 1000n,
      });

      const data = logs.map((event) => {
        const decoded = decodeEventLog({
          abi: [eventAbi],
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

      console.log(logs);

      // console.log('logs:', logs);
      // console.log('data:', data);

      setData(data);
      setLoading(false);
    };

    fetchLogs();
  }, [publicClient]);

  if (loading) {
    return (
      <div>
        <h3>Participants</h3>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ overflowWrap: 'anywhere' }}>
      <h3>Participants</h3>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data.map((el, i) => {
            return (
              <div key={i}>
                {el.data.sender} - {formatEther(el.data.amount)} ETH
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RaffleParticipants;
