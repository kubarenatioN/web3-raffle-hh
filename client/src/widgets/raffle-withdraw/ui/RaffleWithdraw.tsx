import { raffleContract } from '@/shared/config/contracts';
import { gqlPath } from '@/shared/config/gql-path';
import {
  Box,
  Button,
  FormInput,
  IconBox,
  Section,
  Text,
} from '@/shared/ui-kit';
import { ethToUsd } from '@/shared/utils/converters';
import { css } from '@/stitches.config';
import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { Coins, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatEther, parseEther, type Address } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';
import WithdrawItem from './WithdrawItem';

const GET_WITHDRAW_HISTORY = gql`
  query GetWithdrawHistory($dest: Bytes) {
    raffleWinnerFundsSents(
      where: { receiver: $dest }
      orderBy: blockNumber
      orderDirection: desc
    ) {
      id
      amount
      blockNumber
      blockTimestamp
      receiver
      transactionHash
    }
  }
`;

function RaffleWithdraw({ address }: { address: Address }) {
  const [withdrawAmount, setWithdrawAmount] = useState<string | null>(null);

  const { data: withdrawHistory } = useQuery({
    queryKey: ['withdrawHistory', address],
    queryFn: () => request(gqlPath(), GET_WITHDRAW_HISTORY, { dest: address }),
  });

  const withdrawHistoryItems = useMemo(() => {
    const { raffleWinnerFundsSents } = withdrawHistory ?? {};
    if (!raffleWinnerFundsSents) {
      return [];
    }

    if (
      Array.isArray(raffleWinnerFundsSents) &&
      raffleWinnerFundsSents.length > 0
    ) {
      return raffleWinnerFundsSents.map((item) => {
        return {
          id: item.id,
          amount: item.amount,
          blockNumber: item.blockNumber,
          blockTimestamp: item.blockTimestamp,
          transactionHash: item.transactionHash,
        };
      });
    }
    return [];
  }, [withdrawHistory]);

  const { data: winnerBalance = 0n } = useReadContract({
    ...raffleContract,
    functionName: 's_winnerBalance',
    args: [address!],
  });

  const { data: priceFeedAnswer } = useReadContract({
    ...raffleContract,
    functionName: 'getPriceFeedAnswer',
  });

  const { writeContract, isPending } = useWriteContract();

  const totalWithdrawAmountUSD = useMemo(() => {
    if (priceFeedAnswer == null) {
      return 0n;
    }

    const amount = Number.parseFloat(formatEther(winnerBalance));

    const result = ethToUsd(amount, priceFeedAnswer);
    return result.toFixed(4);
  }, [winnerBalance, priceFeedAnswer]);

  const withdrawAmountUSD = useMemo(() => {
    if (priceFeedAnswer == null) {
      return 0;
    }

    let amount = 0;
    if (withdrawAmount == null) {
      amount = Number.parseFloat(formatEther(winnerBalance));
    } else {
      amount = Number.isNaN(Number(withdrawAmount))
        ? 0
        : Number(withdrawAmount);
    }

    return ethToUsd(amount, priceFeedAnswer);
  }, [withdrawAmount, priceFeedAnswer, winnerBalance]);

  const withdraw = () => {
    const amount =
      withdrawAmount == null ? winnerBalance : parseEther(withdrawAmount);
    writeContract({
      ...raffleContract,
      functionName: 'withdraw',
      args: [amount],
    });
  };

  return (
    <Box dir='column' css={{ gap: 16 }}>
      <Box css={{ gap: '6px', alignItems: 'center' }}>
        <IconBox colorType='greenblue'>
          <Trophy />
        </IconBox>
        <h4>Your Winnings</h4>
      </Box>

      <Section
        css={{
          justifyContent: 'space-between',
          borderColor: '#00c95180',
        }}
        className={`success-gradient`}
      >
        <Box
          dir='column'
          css={{
            gap: '12px',
          }}
        >
          <Text size='sm' css={{ color: '$green-100' }}>
            Total Unclaimed
          </Text>
          <Text size='2xl'>{formatEther(winnerBalance)} ETH</Text>
          <Text size='sm' css={{ color: '$green-200' }}>
            ≈ ${totalWithdrawAmountUSD} USD
          </Text>
        </Box>
        <Coins
          className={`${css({
            alignSelf: 'center',
            color: '$green-100',
            opacity: 0.5,
          })}`}
          size={48}
        />
      </Section>

      <Box dir='column' css={{ gap: '6px' }}>
        <FormInput
          suffix='ETH'
          type='number'
          label={<label>Withdraw Amount</label>}
          step='0.001'
          inputMode='decimal'
          value={
            withdrawAmount != null ? withdrawAmount : formatEther(winnerBalance)
          }
          min={0}
          disabled={isPending || !winnerBalance}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <Text size='xs'>≈ ${withdrawAmountUSD?.toFixed(4)} USD</Text>
      </Box>

      <Button
        size='lg'
        variant='success'
        onClick={() => withdraw()}
        disabled={isPending || !winnerBalance}
      >
        {isPending ? 'Withdrawing...' : 'Withdraw'}
      </Button>

      <Box dir='column' css={{ gap: 12 }}>
        {withdrawHistoryItems.map((item) => (
          <WithdrawItem key={item.id} data={item} />
        ))}
      </Box>
    </Box>
  );
}

export default RaffleWithdraw;
