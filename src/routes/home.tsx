import { Calendar } from '@/components/calendar/Calendar';
import { Flex } from '@chakra-ui/react';

const Home = () => (
  <Flex gap={4} direction="column" w="100%">
    <Calendar />
  </Flex>
);

export default Home;
