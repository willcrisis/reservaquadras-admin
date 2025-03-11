import ScheduleAllDayDialogBody, {
  ScheduleAllDayDialogForm as ScheduleAllDayDialogBodyForm,
} from '@/components/calendar/ScheduleDialog/allDay';
import ScheduleDialogBody, {
  ScheduleDialogForm as SchedulePopoverBodyForm,
} from '@/components/calendar/ScheduleDialog/body';
import TypeSelect from '@/components/calendar/ScheduleDialog/TypeSelect';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Schedule } from '@/db/schedule';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

export type ScheduleDialogForm = SchedulePopoverBodyForm;
export type ScheduleAllDayDialogForm = ScheduleAllDayDialogBodyForm;

type ScheduleDialogProps = {
  date: Date;
  isLoading?: boolean;
  allDay?: boolean;
  onSubmit: (data: ScheduleDialogForm | ScheduleAllDayDialogForm) => void;
};

const ScheduleDialog = ({ date, onSubmit, isLoading, allDay }: ScheduleDialogProps) => {
  const [type, setType] = useState<Schedule['type']>();

  return (
    <DialogContent>
      <DialogHeader>
        <HStack justifyContent="space-between">
          <Box flex={1}>
            {type && (
              <Button variant="ghost" onClick={() => setType(undefined)}>
                <LuArrowLeft />
              </Button>
            )}
          </Box>
          <Text fontSize="lg" fontWeight="bold">
            {format(date, "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </Text>
          <Box flex={1} />
        </HStack>
      </DialogHeader>
      <DialogBody>
        <DialogCloseTrigger />
        {!type ? (
          <TypeSelect onSelect={setType} />
        ) : allDay ? (
          <ScheduleAllDayDialogBody date={date} onSubmit={onSubmit} isLoading={isLoading} type={type} />
        ) : (
          <ScheduleDialogBody date={date} onSubmit={onSubmit} isLoading={isLoading} type={type} />
        )}
      </DialogBody>
    </DialogContent>
  );
};

export default ScheduleDialog;
