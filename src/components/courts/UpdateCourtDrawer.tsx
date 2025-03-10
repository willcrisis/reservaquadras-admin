import CourtDrawer, { CourtFormData } from '@/components/courts/CourtDrawer';
import { DrawerRoot } from '@/components/ui/drawer';
import { toaster } from '@/components/ui/toaster';
import { Court, updateCourt } from '@/db/court';
import { DrawerContext, IconButton, UseDialogReturn } from '@chakra-ui/react';
import { useState } from 'react';
import { LuPencil } from 'react-icons/lu';

const UpdateCourtDrawerInner = ({ store, court }: { store: UseDialogReturn; court: Court }) => {
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: CourtFormData) => {
    try {
      setLoading(true);
      const { data: result } = await updateCourt({ ...data, id: data.id! });
      toaster.success({
        title: 'Quadra atualizada',
        description: `ID da quadra: ${result.id}`,
      });
      store.setOpen(false);
    } catch (error) {
      toaster.error({
        title: 'Erro ao atualizar quadra',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CourtDrawer
      onSubmit={onSubmit}
      isLoading={isLoading}
      title="Editar Usuário"
      trigger={
        <IconButton aria-label="Editar" variant="outline" size="sm" title="Editar">
          <LuPencil />
        </IconButton>
      }
      court={court}
    />
  );
};

const UpdateCourtDrawer = ({ court }: { court: Court }) => (
  <DrawerRoot size="xl">
    <DrawerContext>{(store) => <UpdateCourtDrawerInner store={store} court={court} />}</DrawerContext>
  </DrawerRoot>
);
export default UpdateCourtDrawer;
