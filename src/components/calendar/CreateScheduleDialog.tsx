import ScheduleDialog, { ScheduleAllDayDialogForm, ScheduleDialogForm } from '@/components/calendar/ScheduleDialog';
import { toaster } from '@/components/ui/toaster';
import { createAllDaySchedule, createSchedule } from '@/db/schedule';
import { set, startOfDay } from 'date-fns';
import { useState } from 'react';

type CreateScheduleDialogProps = {
  date: Date;
  allDay: boolean;
  onCreated: () => void;
};

const CreateScheduleDialog = ({ date, allDay, onCreated }: CreateScheduleDialogProps) => {
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: ScheduleDialogForm | ScheduleAllDayDialogForm) => {
    const create = allDay ? createAllDaySchedule : createSchedule;
    try {
      setLoading(true);
      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      const [endHour, endMinute] = data.endTime.split(':').map(Number);

      // @ts-expect-error type mix happens here
      const { data: result } = await create({
        ...data,
        startDate: set(startOfDay(date), { hours: startHour, minutes: startMinute }).getTime(),
        endDate: set(startOfDay(date), { hours: endHour, minutes: endMinute }).getTime(),
      });

      toaster.success({
        title: 'Agendamento criado',
        description: `Quantidade de quadras liberadas: ${result.success}`,
      });

      onCreated();
    } catch (error) {
      console.error(error);
      toaster.error({
        title: 'Erro ao criar agendamento',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  return <ScheduleDialog onSubmit={onSubmit} isLoading={isLoading} date={date} allDay={allDay} />;
};

export default CreateScheduleDialog;
