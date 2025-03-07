import ScheduleAllDayDialogBody, {
  ScheduleAllDayDialogForm as ScheduleAllDayDialogBodyForm,
} from '@/components/calendar/ScheduleDialog/allDay';
import ScheduleDialogBody, {
  ScheduleDialogForm as SchedulePopoverBodyForm,
} from '@/components/calendar/ScheduleDialog/body';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type ScheduleDialogForm = SchedulePopoverBodyForm;
export type ScheduleAllDayDialogForm = ScheduleAllDayDialogBodyForm;

type ScheduleDialogProps = {
  date: Date;
  isLoading?: boolean;
  allDay?: boolean;
  onSubmit: (data: ScheduleDialogForm | ScheduleAllDayDialogForm) => void;
};

const ScheduleDialog = ({ date, onSubmit, isLoading, allDay }: ScheduleDialogProps) => (
  <DialogContent>
    <DialogHeader>
      <Text fontSize="lg" fontWeight="bold">
        {format(date, "dd 'de' MMMM 'de' yyyy", {
          locale: ptBR,
        })}
      </Text>
    </DialogHeader>
    <DialogBody>
      <DialogCloseTrigger />
      {allDay ? (
        <ScheduleAllDayDialogBody date={date} onSubmit={onSubmit} isLoading={isLoading} />
      ) : (
        <ScheduleDialogBody date={date} onSubmit={onSubmit} isLoading={isLoading} />
      )}
    </DialogBody>
  </DialogContent>
);

export default ScheduleDialog;
