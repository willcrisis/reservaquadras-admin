import { Button, Text, VStack } from '@chakra-ui/react';
import { Schedule, scheduleDuration, typeName } from '@/db/schedule';
import { getMinutes } from 'date-fns';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { capitalize } from 'lodash';

const height = (schedule: Schedule) => {
  const duration = scheduleDuration(schedule);
  return `${(duration / 30) * 50}%`;
};

const top = (schedule: Schedule) => {
  const minutes = getMinutes(schedule.startDate.toDate());
  return `${minutes > 0 ? 50 : 0}%`;
};

const color = (schedule: Schedule) => {
  if (schedule.type === 'ranking') {
    return 'blue';
  }
  return 'green';
};

type ScheduleButtonProps = {
  schedule: Schedule;
  onClick: (schedule: Schedule) => void;
};

const ScheduleButton = ({ schedule, onClick }: ScheduleButtonProps) => {
  const {
    courts: { list: courts },
    users: { list: users },
  } = useGlobalStore();
  const court = courts.find((court) => court.id === schedule.court.id);
  const players = users.filter((user) => schedule.users?.map((user) => user.id).includes(user.id));
  return (
    <Button
      zIndex={100}
      top={top(schedule)}
      h={height(schedule)}
      flex={1}
      colorPalette={color(schedule)}
      size="xs"
      borderColor={`${color(schedule)}.700`}
      p={1}
      onClick={() => onClick(schedule)}
      opacity={schedule.publishedAt ? 1 : 0.5}
    >
      <VStack display="flex" w="100%" h="100%" alignItems="flex-start" justifyContent="flex-start" gap={1}>
        {players.length > 0 && <Text fontSize="small">{players.map((player) => player.name).join(' x ')}</Text>}
        <Text fontSize="smaller">{court?.name}</Text>
        <Text fontSize="smaller" fontWeight={600}>
          {capitalize(typeName(schedule))}
        </Text>
      </VStack>
    </Button>
  );
};

export default ScheduleButton;
