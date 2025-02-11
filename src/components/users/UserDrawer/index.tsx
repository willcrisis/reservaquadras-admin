import {
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import UserDrawerBody, { UserFormData, UserDrawerBodyProps } from '@/components/users/UserDrawer/body';
import { Button } from '@chakra-ui/react';
import { useRef } from 'react';
import { SubmitHandler } from 'react-hook-form';

export type { UserFormData };

type UserDrawerProps = UserDrawerBodyProps & {
  trigger?: React.ReactNode;
  title?: string;
  onSubmit: SubmitHandler<UserFormData>;
};

const UserDrawer = ({ trigger, title = 'Usuário', ...props }: UserDrawerProps) => {
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
          <UserDrawerBody {...props} contentRef={contentRef} />
        </DrawerBody>
      </DrawerContent>
    </>
  );
};

export default UserDrawer;
