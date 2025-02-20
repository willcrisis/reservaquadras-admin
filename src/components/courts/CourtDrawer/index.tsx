import CourtDrawerBody, { CourtDrawerBodyProps, CourtFormData } from '@/components/courts/CourtDrawer/body';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@chakra-ui/react';
import { useRef } from 'react';
import { SubmitHandler } from 'react-hook-form';

export type { CourtFormData };

type UserDrawerProps = CourtDrawerBodyProps & {
  trigger?: React.ReactNode;
  title?: string;
  onSubmit: SubmitHandler<CourtFormData>;
};

const CourtDrawer = ({ trigger, title = 'Usuário', ...props }: UserDrawerProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <DrawerBackdrop />
      <DrawerTrigger asChild>{trigger || <Button>{title}</Button>}</DrawerTrigger>
      <DrawerContent ref={contentRef}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <CourtDrawerBody {...props} />
        </DrawerBody>
      </DrawerContent>
    </>
  );
};

export default CourtDrawer;
