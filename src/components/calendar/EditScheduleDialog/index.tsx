import EditScheduleDialogBody, {
  EditScheduleDialogForm as EditScheduleDialogBodyForm,
} from '@/components/calendar/EditScheduleDialog/body';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Schedule } from '@/db/schedule';
import { Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRef } from 'react';

export type EditScheduleDialogForm = EditScheduleDialogBodyForm;

type EditScheduleDialogProps = {
  schedule: Schedule;
  isLoading?: boolean;
  onSubmit: (data: EditScheduleDialogForm) => void;
};

const EditScheduleDialogWrapper = ({ schedule, onSubmit, isLoading }: EditScheduleDialogProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <DialogContent ref={contentRef}>
      <DialogHeader>
        <Text fontSize="lg" fontWeight="bold">
          {format(schedule.startDate, "dd 'de' MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </Text>
      </DialogHeader>
      <DialogBody>
        <DialogCloseTrigger />
        <EditScheduleDialogBody schedule={schedule} onSubmit={onSubmit} isLoading={isLoading} portalRef={contentRef} />
      </DialogBody>
    </DialogContent>
  );
};

export default EditScheduleDialogWrapper;
