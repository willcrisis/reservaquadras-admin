import ScheduleButton from '@/components/calendar/ScheduleButton';
import { Schedule } from '@/db/schedule';
import { Table, Button, HStack } from '@chakra-ui/react';
import { format, setMinutes, setHours } from 'date-fns';

type CalendarCellProps = {
  date: Date;
  hour: number;
  schedules: Schedule[];
  onClick: (date: Date) => void;
  onEdit: (schedule: Schedule) => void;
};

const CalendarCell = ({ date, hour, schedules, onClick, onEdit }: CalendarCellProps) => (
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
    {schedules.length > 0 && (
      <HStack w="80%" h="100%" position="absolute" top={0} left={0} alignItems="flex-start" gap={0}>
        {schedules.map((schedule) => (
          <ScheduleButton key={schedule.id} schedule={schedule} onClick={onEdit} />
        ))}
      </HStack>
    )}
  </Table.Cell>
);

export default CalendarCell;
