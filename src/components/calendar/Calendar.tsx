import CreateSchedulePopover from '@/components/calendar/CreateSchedulePopover';
import { Button, HStack, Table, Text, VStack } from '@chakra-ui/react';
import { CalendarViewType, isSameDate, useCalendar } from '@h6s/calendar';
import { format, set, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import range from 'lodash/range';
import { LuArrowLeft, LuArrowRight, LuCalendar } from 'react-icons/lu';

const today = startOfDay(new Date());

export const Calendar = () => {
  const { body, navigation, month, year, headers } = useCalendar({
    defaultViewType: CalendarViewType.Week,
    defaultWeekStart: 1,
  });

  const [{ key: weekKey, value: days }] = body.value;

  return (
    <>
      <Table.Root>
        <Table.Header position="sticky" top={0} bg="white" zIndex="sticky">
          <Table.Row>
            <Table.ColumnHeader textAlign="center" w="10%">
              <HStack>
                <Button onClick={navigation.toPrev}>
                  <LuArrowLeft />
                </Button>
                <Text textAlign="center">
                  {format(new Date(year, month), 'MMM yyyy', {
                    locale: ptBR,
                  }).toUpperCase()}
                </Text>
                <Button onClick={navigation.toNext}>
                  <LuArrowRight />
                </Button>
                <Button variant="outline" onClick={navigation.setToday} title="Ir para Hoje">
                  <LuCalendar />
                </Button>
              </HStack>
            </Table.ColumnHeader>
            {headers.weekDays.map(({ key, value }) => (
              <Table.ColumnHeader key={key} textAlign="center">
                <VStack>
                  <Text>{format(value, 'EEEEEE', { locale: ptBR })}</Text>
                  <Button
                    variant={isSameDate(value, today) ? 'solid' : 'outline'}
                    p={2}
                    borderRadius="full"
                    w="40px"
                    h="40px"
                    title="Liberar dia inteiro"
                  >
                    {format(value, 'dd', { locale: ptBR })}
                  </Button>
                </VStack>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {range(24).map((hour) => (
            <Table.Row key={`${weekKey}-${hour}`}>
              <Table.Cell key="hour">
                <Text fontSize="xs">
                  {format(set(new Date(), { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 }), 'HH:mm')}
                </Text>
              </Table.Cell>
              {days.map(({ key, value: day }) => (
                <Table.Cell key={key} borderLeft="1px solid {colors.gray.200}" p={0}>
                  <CreateSchedulePopover title={`${format(day, 'dd/MM/yyyy')} - ${hour}:00`} date={day} hour={hour} />
                  <CreateSchedulePopover
                    title={`${format(day, 'dd/MM/yyyy')} - ${hour}:30`}
                    date={day}
                    hour={hour}
                    half
                  />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};
