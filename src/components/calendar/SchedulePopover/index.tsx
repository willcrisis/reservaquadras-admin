import SchedulePopoverBody, {
  SchedulePopoverForm as SchedulePopoverBodyForm,
} from '@/components/calendar/SchedulePopover/body';
import { PopoverBody, PopoverCloseTrigger, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@chakra-ui/react';

export type SchedulePopoverForm = SchedulePopoverBodyForm;

type SchedulePopoverProps = {
  title: string;
  date: Date;
  hour: number;
  half?: boolean;
  isLoading?: boolean;
  onSubmit: (data: SchedulePopoverForm) => void;
};

const SchedulePopover = ({ title, date, hour, half, onSubmit, isLoading }: SchedulePopoverProps) => (
  <>
    <PopoverTrigger w="100%" asChild>
      <Button variant="ghost" w="100%" size="xs" title={title} />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverBody>
        <PopoverCloseTrigger />
        <SchedulePopoverBody date={date} hour={hour} half={half} onSubmit={onSubmit} isLoading={isLoading} />
      </PopoverBody>
    </PopoverContent>
  </>
);

export default SchedulePopover;
