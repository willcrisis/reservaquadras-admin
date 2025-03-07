import EditScheduleDialogWrapper, { EditScheduleDialogForm } from '@/components/calendar/EditScheduleDialog/index';
import { toaster } from '@/components/ui/toaster';
import { Schedule, updateSchedule } from '@/db/schedule';
import { set, startOfDay } from 'date-fns';
import { useState } from 'react';

type EditScheduleDialogProps = {
  schedule: Schedule;
  onUpdated: () => void;
  onDeleted: () => void;
  onPublished: () => void;
};

const EditScheduleDialog = ({ schedule, onUpdated, onDeleted, onPublished }: EditScheduleDialogProps) => {
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: EditScheduleDialogForm) => {
    try {
      setLoading(true);
      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      const [endHour, endMinute] = data.endTime.split(':').map(Number);

      const { data: result } = await updateSchedule({
        ...data,
        startDate: set(startOfDay(schedule.startDate.toDate()), { hours: startHour, minutes: startMinute }).getTime(),
        endDate: set(startOfDay(schedule.endDate.toDate()), { hours: endHour, minutes: endMinute }).getTime(),
      });

      toaster.success({
        title: 'Agendamento atualizado',
        description: `ID do agendamento: ${result.id}`,
      });

      onUpdated();
    } catch (error) {
      console.error(error);
      toaster.error({
        title: 'Erro ao atualizar agendamento',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditScheduleDialogWrapper
      schedule={schedule}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onDeleted={onDeleted}
      onPublished={onPublished}
    />
  );
};

export default EditScheduleDialog;
