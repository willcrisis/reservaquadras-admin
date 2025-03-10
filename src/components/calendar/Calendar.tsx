import CalendarCell from '@/components/calendar/CalendarCell';
import CreateScheduleDialog from '@/components/calendar/CreateScheduleDialog';
import EditScheduleDialog from '@/components/calendar/EditScheduleDialog';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { toaster } from '@/components/ui/toaster';
import { Tooltip } from '@/components/ui/tooltip';
import { publishAll, Schedule, useSchedules } from '@/db/schedule';
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
import { FirebaseError } from 'firebase/app';
import range from 'lodash/range';
import { useCallback, useMemo, useState } from 'react';
import { LuArrowLeft, LuArrowRight, LuCalendar } from 'react-icons/lu';

const today = startOfDay(new Date());

const filterSchedules = (schedules: Schedule[], date: Date, hour: number) =>
  schedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.startDate.toDate());
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

  const [schedules, { loading, error }] = useSchedules(firstDay, lastDay);

  const hasUnpublishedSchedules = useMemo(() => schedules.some((schedule) => !schedule.publishedAt), [schedules]);

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [allDay, setAllDay] = useState(false);
  const [publishing, setPublishing] = useState(false);

  if (error) {
    console.error(error);
    return <Text>Erro ao carregar agendamentos</Text>;
  }

  const onCreateSchedule = (date: Date, allDay = false) => {
    setSelectedDate(date);
    setAllDay(allDay);
    setOpen(true);
  };

  const onCloseDialog = (open: boolean) => {
    setSelectedDate(null);
    setSelectedSchedule(null);
    setOpen(open);
  };

  const onEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setOpen(true);
  };

  const onPublishAll = async () => {
    try {
      setPublishing(true);
      const result = await publishAll({ startDate: firstDay.getTime(), endDate: lastDay.getTime() });
      toaster.success({
        title: 'Agendamentos publicados',
        description: `${result.data.success} agendamentos publicados`,
      });
    } catch (error) {
      toaster.error({
        title: 'Erro ao publicar agendamentos',
        description: (error as FirebaseError).message,
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <DialogRoot lazyMount open={open} onOpenChange={(e) => onCloseDialog(e.open)} unmountOnExit>
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
                  <Tooltip content="Semana anterior">
                    <Button onClick={toPrev} size="xs">
                      <LuArrowLeft />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Próxima semana">
                    <Button onClick={toNext} size="xs">
                      <LuArrowRight />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Ir para Hoje">
                    <Button variant="outline" onClick={setToday} title="Ir para Hoje" size="xs" loading={loading}>
                      <LuCalendar />
                    </Button>
                  </Tooltip>
                  {hasUnpublishedSchedules && (
                    <ConfirmationDialog
                      title="Publicar agendamentos"
                      description="Tem certeza que deseja publicar todos os agendamentos desta semana?"
                      onConfirm={onPublishAll}
                      triggerAsChild={false}
                    >
                      <Tooltip content="Publicar agendamentos">
                        <Button
                          size="xs"
                          colorPalette="red"
                          title="Publicar agendamentos"
                          loading={publishing}
                          disabled={publishing}
                          animation="bounce"
                        >
                          {schedules.filter((schedule) => !schedule.publishedAt).length}
                        </Button>
                      </Tooltip>
                    </ConfirmationDialog>
                  )}
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
                    onClick={() => onCreateSchedule(date, true)}
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
                  onClick={onCreateSchedule}
                  onEdit={onEditSchedule}
                  schedules={filterSchedules(schedules, date, hour)}
                />
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {selectedDate && (
        <CreateScheduleDialog date={selectedDate} onCreated={() => onCloseDialog(false)} allDay={allDay} />
      )}
      {selectedSchedule && (
        <EditScheduleDialog
          schedule={selectedSchedule}
          onUpdated={() => onCloseDialog(false)}
          onDeleted={() => onCloseDialog(false)}
          onPublished={() => onCloseDialog(false)}
        />
      )}
    </DialogRoot>
  );
};
