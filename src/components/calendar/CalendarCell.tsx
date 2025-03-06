import ScheduleButton from '@/components/calendar/ScheduleButton';
import { Schedule } from '@/db/schedule';
import { Table, Button, HStack } from '@chakra-ui/react';
import { format, setMinutes, setHours } from 'date-fns';

type CalendarCellProps = {
  date: Date;
  hour: number;
  rankings: Schedule[];
  casuals: Schedule[];
  onClick: (date: Date) => void;
};

const CalendarCell = ({ date, hour, rankings, casuals, onClick }: CalendarCellProps) => (
  <Table.Cell key={date.getTime()} borderLeft="1px solid {colors.gray.200}" p={0} position="relative">
    <Button
      variant="ghost"
      w="100%"
      size="xs"
      title={`${format(date, 'dd/MM/yyyy')} - ${hour}:00`}
      onClick={() => onClick(setHours(date, hour))}
    />
    <Button
      variant="ghost"
      w="100%"
      size="xs"
      title={`${format(date, 'dd/MM/yyyy')} - ${hour}:30`}
      onClick={() => onClick(setMinutes(setHours(date, hour), 30))}
    />
    {(rankings.length > 0 || casuals.length > 0) && (
      <HStack w="80%" h="100%" position="absolute" top={0} left={0} alignItems="flex-start" gap={0}>
        {rankings.map((schedule) => (
          <ScheduleButton key={schedule.id} schedule={schedule} color="blue" />
        ))}
        {casuals.map((schedule) => (
          <ScheduleButton key={schedule.id} schedule={schedule} color="green" />
        ))}
      </HStack>
    )}
  </Table.Cell>
);

export default CalendarCell;
