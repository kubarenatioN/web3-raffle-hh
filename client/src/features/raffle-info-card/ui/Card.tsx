import { Section, Text } from '@/shared/ui-kit';

export interface CardProps {
  data: CardData;
}

interface CardData {
  title?: string;
  value?: string;
}

function Card({ data }: CardProps) {
  const { title = '', value = '' } = data;

  return (
    <Section dir='column' css={{ gap: '12px' }}>
      <Text size='lg' weight='bold'>
        {value}
      </Text>
      <Text size='sm'>{title}</Text>
    </Section>
  );
}

export default Card;
