export interface IRaffleRoundRecord {
  round: number;
  winner: string;
  amount: number;
}

function RaffleRoundRecord({ data }: { data: IRaffleRoundRecord }) {
  const { round, winner, amount } = data;

  return (
    <div>
      <h4>{round}</h4>
      <span>{winner}</span>
      <span>{amount}</span>
    </div>
  );
}

export default RaffleRoundRecord;
