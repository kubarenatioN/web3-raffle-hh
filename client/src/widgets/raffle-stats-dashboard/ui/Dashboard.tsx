import { raffleContract } from '@/shared/config/contracts';
import {
  Box,
  IconBox,
  Section,
  Text,
  type IconBoxColorType,
} from '@/shared/ui-kit';
import { Clock, Coins, Trophy, Users } from 'lucide-react';
import { useMemo } from 'react';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';

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
    const data = {
      totalFundsDrawn: formatEther(totalFundsDrawn),
      uniquePlayersCount: uniquePlayersCount.toString(),
      totalDrawsCount: totalDrawsCount.toString(),
      recentDrawAt: recentDrawAt
        ? new Date(Number(recentDrawAt) * 1000).toLocaleString()
        : 'N/A',
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
        title: 'Next Draw In',
        value: '2h 30m',
        icon: <Clock />,
        color: 'lime',
      },
    ];
  }, [totalFundsDrawn, uniquePlayersCount, totalDrawsCount, recentDrawAt]);

  return (
    <Box css={{ gap: '1rem' }}>
      {viewData.map((card) => {
        return (
          <Section
            key={card.title}
            css={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: '1 1 25%',
              gap: 12,
            }}
          >
            <IconBox colorType={card.color as IconBoxColorType}>
              {card.icon}
            </IconBox>
            <Text size='xl'>{card.value}</Text>
            <Text size='sm' css={{ color: '$pink-100' }}>
              {card.title}
            </Text>
          </Section>
        );
      })}
    </Box>
  );
}

export default Dashboard;
