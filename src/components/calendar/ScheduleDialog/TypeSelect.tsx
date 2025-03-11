import { Schedule } from '@/db/schedule';
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { PiTennisBall, PiRanking } from 'react-icons/pi';

type Props = {
  onSelect: (type: Schedule['type']) => void;
};

const TypeSelect = ({ onSelect }: Props) => (
  <VStack gap={8}>
    <Text>Qual tipo de partida deseja criar?</Text>
    <HStack gap={12}>
      <Button variant="outline" onClick={() => onSelect('ranking')} size="2xl">
        <PiRanking />
        Ranking
      </Button>
      <Button variant="outline" onClick={() => onSelect('casual')} size="2xl">
        <PiTennisBall />
        Bate-bola
      </Button>
    </HStack>
  </VStack>
);

export default TypeSelect;
