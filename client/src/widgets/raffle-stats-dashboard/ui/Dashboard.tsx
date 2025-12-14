import { raffleContract } from '@/shared/config/contracts';
import { flex } from '@/shared/ui-kit/utils';
import { styled } from '@/stitches.config';
import { useMemo } from 'react';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';

const Box = styled('div', {});

function Dashboard() {
  const { data: totalFundsDrawn } = useReadContract({
    ...raffleContract,
    functionName: 'getTotalFundsDrawn',
  });

  const { data: uniquePlayersCount } = useReadContract({
    ...raffleContract,
    functionName: 'getUniquePlayersCount',
  });

  const { data: totalDrawsCount } = useReadContract({
    ...raffleContract,
    functionName: 'getTotalDrawsCount',
  });

  const { data: recentDrawAt } = useReadContract({
    ...raffleContract,
    functionName: 's_recentDrawAt',
  });

  // Memoize formatted values for performance
  const viewData = useMemo(() => {
    return {
      totalFundsDrawn: totalFundsDrawn ? formatEther(totalFundsDrawn) : '0',
      uniquePlayersCount: uniquePlayersCount?.toString() ?? '0',
      totalDrawsCount: totalDrawsCount?.toString() ?? '0',
      recentDrawAt: recentDrawAt
        ? new Date(Number(recentDrawAt) * 1000).toLocaleString()
        : 'N/A',
    };
  }, [totalFundsDrawn, uniquePlayersCount, totalDrawsCount, recentDrawAt]);

  return (
    <Box css={{ gap: '1rem' }} className={flex()}>
      <div>
        <h3>Total Prize Pool</h3>
        <p>{viewData.totalFundsDrawn} ETH</p>
      </div>
      <div>
        <h3>Current Participants</h3>
        <p>{viewData.uniquePlayersCount}</p>
      </div>
      <div>
        <h3>Total Draws</h3>
        <p>{viewData.totalDrawsCount}</p>
      </div>
      <div>
        <h3>Next Draw In</h3>
        <p>{'2h 30m'}</p>
      </div>
    </Box>
  );
}

export default Dashboard;
