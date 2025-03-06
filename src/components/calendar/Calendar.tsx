import CreateScheduleDialog from '@/components/calendar/CreateScheduleDialog';
import { useSchedules } from '@/db/schedule';
import { Button, DialogRoot, HStack, Table, Text, VStack } from '@chakra-ui/react';
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  set,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import range from 'lodash/range';
import { useCallback, useMemo, useState } from 'react';
import { LuArrowLeft, LuArrowRight, LuCalendar } from 'react-icons/lu';

const today = startOfDay(new Date());

export const Calendar = () => {
  const [offset, setOffset] = useState(0);

  const [firstDay, lastDay, days] = useMemo(() => {
    const startDate = startOfWeek(addWeeks(today, offset));
    const endDate = endOfWeek(startDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return [startDate, endDate, days];
  }, [offset]);

  const toPrev = useCallback(() => setOffset((offset) => offset - 1), []);
  const toNext = useCallback(() => setOffset((offset) => offset + 1), []);
  const setToday = useCallback(() => setOffset(0), []);

  const [schedules, { loading, error }] = useSchedules('ranking', firstDay, lastDay);
  console.log(schedules);

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  if (error) {
    return <Text>Erro ao carregar agendamentos</Text>;
  }

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
                  <Button variant="outline" onClick={setToday} title="Ir para Hoje" size="xs" loading={loading}>
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
                  >
                    {format(date, 'dd', { locale: ptBR })}
                  </Button>
                </VStack>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {range(24).map((hour, i) => (
            <Table.Row key={`${firstDay.getTime()}-${hour}`}>
              <Table.Cell key="hour">
                <Text fontSize="xs">
                  {format(set(new Date(), { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 }), 'HH:mm')}
                </Text>
              </Table.Cell>
              {days.map((date) => (
                <Table.Cell key={date.getTime()} borderLeft="1px solid {colors.gray.200}" p={0} position="relative">
                  <Button
                    variant="ghost"
                    w="100%"
                    size="xs"
                    title={`${format(date, 'dd/MM/yyyy')} - ${hour}:00`}
                    onClick={() => {
                      setSelectedDate(setHours(date, hour));
                      setOpen(true);
                    }}
                  />
                  <Button
                    variant="ghost"
                    w="100%"
                    size="xs"
                    title={`${format(date, 'dd/MM/yyyy')} - ${hour}:30`}
                    onClick={() => {
                      setSelectedDate(setMinutes(setHours(date, hour), 30));
                      setOpen(true);
                    }}
                  />
                  {/* {i % 2 === 0 && <Button zIndex={100} position="absolute" top={0} left={0} w="80%" h="150%" />} */}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {selectedDate && <CreateScheduleDialog date={selectedDate} onCreated={() => setOpen(false)} />}
    </DialogRoot>
  );
};
