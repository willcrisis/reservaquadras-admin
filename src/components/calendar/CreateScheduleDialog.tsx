import ScheduleDialog, { ScheduleDialogForm } from '@/components/calendar/ScheduleDialog';
import { toaster } from '@/components/ui/toaster';
import { createSchedule } from '@/db/schedule';
import { set, startOfDay } from 'date-fns';
import { useState } from 'react';

type CreateScheduleDialogProps = {
  date: Date;
  onCreated: () => void;
};

const CreateScheduleDialog = ({ date, onCreated }: CreateScheduleDialogProps) => {
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: ScheduleDialogForm) => {
    try {
      setLoading(true);
      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      const [endHour, endMinute] = data.endTime.split(':').map(Number);

      const { data: result } = await createSchedule({
        ...data,
        startDate: set(startOfDay(date), { hours: startHour, minutes: startMinute }).getTime(),
        endDate: set(startOfDay(date), { hours: endHour, minutes: endMinute }).getTime(),
      });

      toaster.success({
        title: 'Agendamento criado',
        description: `ID do agendamento: ${result.id}`,
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

  return <ScheduleDialog onSubmit={onSubmit} isLoading={isLoading} date={date} />;
};

export default CreateScheduleDialog;
