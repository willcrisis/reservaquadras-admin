import SchedulePopover, { SchedulePopoverForm } from '@/components/calendar/SchedulePopover';
import { toaster } from '@/components/ui/toaster';
import { createSchedule } from '@/db/schedule';
import { PopoverRoot } from '@chakra-ui/react';
import { set, startOfDay } from 'date-fns';
import { useState } from 'react';

type CreateSchedulePopoverProps = {
  date: Date;
  hour: number;
  half?: boolean;
  title?: string;
};

const CreateSchedulePopover = ({ date, hour, half, title = 'Novo agendamento' }: CreateSchedulePopoverProps) => {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: SchedulePopoverForm) => {
    try {
      setLoading(true);
      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      const [endHour, endMinute] = data.endTime.split(':').map(Number);

      const { data: result } = await createSchedule({
        ...data,
        startDate: set(startOfDay(date), { hours: startHour, minutes: startMinute }),
        endDate: set(startOfDay(date), { hours: endHour, minutes: endMinute }),
      });

      toaster.success({
        title: 'Agendamento criado',
        description: `ID do agendamento: ${result.id}`,
      });

      setOpen(false);
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

  return (
    <PopoverRoot
      positioning={{ placement: 'right-start' }}
      lazyMount
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      unmountOnExit
    >
      <SchedulePopover onSubmit={onSubmit} isLoading={isLoading} title={title} date={date} hour={hour} half={half} />
    </PopoverRoot>
  );
};

export default CreateSchedulePopover;
