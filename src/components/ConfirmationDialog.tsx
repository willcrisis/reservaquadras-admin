import {
  DialogTrigger,
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from '@/components/ui/dialog';

import { Button } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type ConfirmationDialogProps = {
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmationDialog = ({
  title,
  children,
  description,
  onConfirm,
  onCancel,
}: PropsWithChildren<ConfirmationDialogProps>) => (
  <DialogRoot>
    <DialogTrigger asChild>{children || <Button>{title}</Button>}</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogBody>{description || 'Tem certeza?'}</DialogBody>
      <DialogFooter>
        <DialogActionTrigger asChild>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </DialogActionTrigger>
        <Button onClick={onConfirm}>Confirmar</Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>
);

export default ConfirmationDialog;
