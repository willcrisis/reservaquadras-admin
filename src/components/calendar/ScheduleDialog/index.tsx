import ScheduleDialogBody, {
  ScheduleDialogForm as SchedulePopoverBodyForm,
} from '@/components/calendar/ScheduleDialog/body';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type ScheduleDialogForm = SchedulePopoverBodyForm;

type ScheduleDialogProps = {
  date: Date;
  isLoading?: boolean;
  onSubmit: (data: ScheduleDialogForm) => void;
};

const ScheduleDialog = ({ date, onSubmit, isLoading }: ScheduleDialogProps) => (
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
      <ScheduleDialogBody date={date} onSubmit={onSubmit} isLoading={isLoading} />
    </DialogBody>
  </DialogContent>
);

export default ScheduleDialog;
