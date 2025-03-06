import CalendarCell from '@/components/calendar/CalendarCell';
import CreateScheduleDialog from '@/components/calendar/CreateScheduleDialog';
import { Schedule, useSchedules } from '@/db/schedule';
import { Button, DialogRoot, HStack, Table, Text, VStack } from '@chakra-ui/react';
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isSameHour,
  set,
  setHours,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import range from 'lodash/range';
import { useCallback, useMemo, useState } from 'react';
import { LuArrowLeft, LuArrowRight, LuCalendar } from 'react-icons/lu';

const today = startOfDay(new Date());

const filterSchedules = (schedules: Schedule[], date: Date, hour: number) =>
  schedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.startDate);
    const cellDate = setHours(date, hour);
    return isSameDay(scheduleDate, cellDate) && isSameHour(scheduleDate, cellDate);
  });

export const Calendar = () => {
  const [offset, setOffset] = useState(0);

  const [firstDay, lastDay, days] = useMemo(() => {
    const startDate = startOfWeek(addWeeks(today, offset), { weekStartsOn: 1 });
    const endDate = endOfWeek(startDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return [startDate, endDate, days];
  }, [offset]);

  const toPrev = useCallback(() => setOffset((offset) => offset - 1), []);
  const toNext = useCallback(() => setOffset((offset) => offset + 1), []);
  const setToday = useCallback(() => setOffset(0), []);

  const [rankings, { loading: loadingRankings, error }] = useSchedules('ranking', firstDay, lastDay);
  const [casuals, { loading: loadingCasuals, error: errorCasuals }] = useSchedules('casual', firstDay, lastDay);

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [allDay, setAllDay] = useState(false);

  if (error || errorCasuals) {
    return <Text>Erro ao carregar agendamentos</Text>;
  }

  const onSelectedDate = (date: Date, allDay = false) => {
    setSelectedDate(date);
    setAllDay(allDay);
    setOpen(true);
  };

  return (
    <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)} unmountOnExit>
      <Table.Root>
        <Table.Header position="sticky" top={0} bg="white" zIndex="sticky">
          <Table.Row>
            <Table.ColumnHeader textAlign="center" w="10%">
              <VStack>
                <Text textAlign="center">
                  {format(new Date(firstDay), 'dd MMM - ', {
                    locale: ptBR,
                  }).toUpperCase()}
                  {format(new Date(lastDay), 'dd MMM', {
                    locale: ptBR,
                  }).toUpperCase()}
                </Text>
                <HStack>
                  <Button onClick={toPrev} size="xs">
                    <LuArrowLeft />
                  </Button>
                  <Button onClick={toNext} size="xs">
                    <LuArrowRight />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={setToday}
                    title="Ir para Hoje"
                    size="xs"
                    loading={loadingRankings || loadingCasuals}
                  >
                    <LuCalendar />
                  </Button>
                </HStack>
              </VStack>
            </Table.ColumnHeader>
            {days.map((date) => (
              <Table.ColumnHeader key={date.getTime()} textAlign="center">
                <VStack>
                  <Text>{format(date, 'EEEEEE', { locale: ptBR })}</Text>
                  <Button
                    variant={isSameDay(date, today) ? 'solid' : 'outline'}
                    p={2}
                    borderRadius="full"
                    w="40px"
                    h="40px"
                    title="Liberar dia inteiro"
                    onClick={() => onSelectedDate(date, true)}
                  >
                    {format(date, 'dd', { locale: ptBR })}
                  </Button>
                </VStack>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {range(24).map((hour) => (
            <Table.Row key={`${firstDay.getTime()}-${hour}`}>
              <Table.Cell key="hour">
                <Text fontSize="xs">
                  {format(set(new Date(), { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 }), 'HH:mm')}
                </Text>
              </Table.Cell>
              {days.map((date) => (
                <CalendarCell
                  key={date.getTime()}
                  date={date}
                  hour={hour}
                  onClick={onSelectedDate}
                  rankings={filterSchedules(rankings, date, hour)}
                  casuals={filterSchedules(casuals, date, hour)}
                />
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {selectedDate && <CreateScheduleDialog date={selectedDate} onCreated={() => setOpen(false)} allDay={allDay} />}
    </DialogRoot>
  );
};
