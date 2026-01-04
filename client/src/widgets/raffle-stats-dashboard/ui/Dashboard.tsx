import { raffleContract } from '@/shared/config/contracts';
import { IconBox, Section, Text, type IconBoxColorType } from '@/shared/ui-kit';
import { format } from 'date-fns';
import { Clock, Coins, Trophy, Users } from 'lucide-react';
import { useMemo } from 'react';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { data: totalFundsDrawn = 0n } = useReadContract({
    ...raffleContract,
    functionName: 'getTotalFundsDrawn',
  });

  const { data: uniquePlayersCount = 0n } = useReadContract({
    ...raffleContract,
    functionName: 'getUniquePlayersCount',
  });

  const { data: totalDrawsCount = 0n } = useReadContract({
    ...raffleContract,
    functionName: 'getTotalDrawsCount',
  });

  const { data: recentDrawAt } = useReadContract({
    ...raffleContract,
    functionName: 's_recentDrawAt',
  });

  // Memoize formatted values for performance
  const viewData = useMemo(() => {
    const _formatRecentDrawAt = () => {
      const _d = new Date(Number(recentDrawAt) * 1000);
      return format(_d, 'dd MMM uu, HH:mm');
    };
    const data = {
      totalFundsDrawn: formatEther(totalFundsDrawn),
      uniquePlayersCount: uniquePlayersCount.toString(),
      totalDrawsCount: totalDrawsCount.toString(),
      recentDrawAt: recentDrawAt ? _formatRecentDrawAt() : '-',
    };

    return [
      {
        title: 'Total Prize Pool',
        value: data.totalFundsDrawn,
        icon: <Coins />,
        color: 'orange',
      },
      {
        title: 'Current Participants',
        value: data.uniquePlayersCount,
        icon: <Users />,
        color: 'sky',
      },
      {
        title: 'Total Draws',
        value: data.totalDrawsCount,
        icon: <Trophy />,
        color: 'pink',
      },
      {
        title: 'Recent Draw At',
        value: data.recentDrawAt,
        icon: <Clock />,
        color: 'lime',
      },
    ];
  }, [totalFundsDrawn, uniquePlayersCount, totalDrawsCount, recentDrawAt]);

  return (
    <div className={styles.container}>
      {viewData.map((card) => {
        return (
          <Section key={card.title} dir='column' align='start'>
            <IconBox colorType={card.color as IconBoxColorType}>
              {card.icon}
            </IconBox>
            <Text
              size='sm'
              css={{ color: '$pink-100', padding: '0.8rem 0 0.2rem' }}
            >
              {card.title}
            </Text>
            <Text size='xl'>{card.value}</Text>
          </Section>
        );
      })}
    </div>
  );
}

export default Dashboard;
