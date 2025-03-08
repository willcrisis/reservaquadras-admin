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

import { Button, DialogContext } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type ConfirmationDialogProps = {
  title: string;
  description?: string;
  triggerAsChild?: boolean;
  onConfirm?: () => Promise<void>;
  onCancel?: () => void;
};

const ConfirmationDialogBody = ({
  title,
  description,
  store,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps & {
  store: {
    setOpen: (open: boolean) => void;
  };
}) => {
  const handleConfirm = async () => {
    try {
      if (onConfirm) {
        await onConfirm();
      }
      store.setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
        <Button onClick={handleConfirm}>Confirmar</Button>
      </DialogFooter>
    </DialogContent>
  );
};

const ConfirmationDialog = ({
  title,
  children,
  description,
  triggerAsChild = true,
  onConfirm,
  onCancel,
}: PropsWithChildren<ConfirmationDialogProps>) => (
  <DialogRoot>
    <DialogTrigger asChild={triggerAsChild}>{children || <Button>{title}</Button>}</DialogTrigger>
    <DialogContext>
      {(store) => (
        <ConfirmationDialogBody
          title={title}
          description={description}
          onCancel={onCancel}
          onConfirm={onConfirm}
          store={store}
        />
      )}
    </DialogContext>
  </DialogRoot>
);

export default ConfirmationDialog;
