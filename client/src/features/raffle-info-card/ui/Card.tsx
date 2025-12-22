import { Section, Text } from '@/shared/ui-kit';
import { styled } from '@/stitches.config';

export interface CardProps {
  data: CardData;
}

interface CardData {
  title?: string;
  value?: string;
}

const CardWrapper = styled(Section, {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '1rem',
});

function Card({ data }: CardProps) {
  const { title = '', value = '' } = data;

  return (
    <CardWrapper>
      <Text size='lg' weight='bold'>
        {value}
      </Text>
      <Text size='sm'>{title}</Text>
    </CardWrapper>
  );
}

export default Card;
