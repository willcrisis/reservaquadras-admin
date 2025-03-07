import EditScheduleDialogBody, {
  EditScheduleDialogForm as EditScheduleDialogBodyForm,
} from '@/components/calendar/EditScheduleDialog/body';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { toaster } from '@/components/ui/toaster';
import { deleteSchedule, Schedule } from '@/db/schedule';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { HStack, IconButton, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRef, useState } from 'react';
import { LuTrash } from 'react-icons/lu';

export type EditScheduleDialogForm = EditScheduleDialogBodyForm;

type EditScheduleDialogProps = {
  schedule: Schedule;
  isLoading?: boolean;
  onSubmit: (data: EditScheduleDialogForm) => void;
  onDeleted?: () => void;
  onPublished?: () => void;
};

const EditScheduleDialogWrapper = ({
  schedule,
  onSubmit,
  onDeleted,
  onPublished,
  isLoading,
}: EditScheduleDialogProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const {
    courts: { list: courts },
  } = useGlobalStore();

  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSchedule({ id: schedule.id! });
      toaster.success({
        title: 'Agendamento excluído',
        description: `ID do agendamento: ${result.data.id}`,
      });
      onDeleted?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DialogContent ref={contentRef}>
      <DialogHeader>
        <HStack>
          <Text fontSize="lg" fontWeight="bold">
            {format(schedule.startDate.toDate(), "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}{' '}
            - {courts.find((court) => court.id === schedule.court.id)?.name}
          </Text>
          <ConfirmationDialog
            title="Excluir agendamento"
            description="Tem certeza que deseja excluir este agendamento?"
            onConfirm={onDelete}
          >
            <IconButton
              aria-label="Excluir"
              variant="ghost"
              colorPalette="red"
              size="sm"
              title="Excluir"
              loading={isDeleting}
              disabled={isDeleting}
            >
              <LuTrash />
            </IconButton>
          </ConfirmationDialog>
          <DialogCloseTrigger />
        </HStack>
      </DialogHeader>
      <DialogBody>
        <EditScheduleDialogBody
          schedule={schedule}
          onSubmit={onSubmit}
          isLoading={isLoading}
          portalRef={contentRef}
          onPublished={onPublished}
        />
      </DialogBody>
    </DialogContent>
  );
};

export default EditScheduleDialogWrapper;
