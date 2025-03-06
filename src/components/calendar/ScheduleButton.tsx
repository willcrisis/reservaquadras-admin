import { Button } from '@chakra-ui/react';
import { Schedule, scheduleDuration } from '@/db/schedule';
import { getMinutes } from 'date-fns';

const height = (schedule: Schedule) => {
  const duration = scheduleDuration(schedule);
  return `${(duration / 30) * 50}%`;
};

const top = (schedule: Schedule) => {
  const minutes = getMinutes(schedule.startDate);
  return `${minutes > 0 ? 50 : 0}%`;
};

type ScheduleButtonProps = {
  schedule: Schedule;
  color: string;
};

const ScheduleButton = ({ schedule, color }: ScheduleButtonProps) => (
  <Button
    zIndex={100}
    // position="absolute"
    top={top(schedule)}
    // left={0}
    // w="100%"
    h={height(schedule)}
    flex={1}
    colorPalette={color}
    size="xs"
    // border="1px solid"
    borderColor={`${color}.700`}
  />
);

export default ScheduleButton;
