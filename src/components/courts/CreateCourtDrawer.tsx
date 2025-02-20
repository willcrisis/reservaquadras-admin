import CourtDrawer, { CourtFormData } from '@/components/courts/CourtDrawer';
import { DrawerRoot } from '@/components/ui/drawer';
import { toaster } from '@/components/ui/toaster';
import { createCourt } from '@/db/court';
import { DrawerContext, UseDialogReturn } from '@chakra-ui/react';
import { useState } from 'react';

const CreateCourtDrawerInner = ({ store }: { store: UseDialogReturn }) => {
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: CourtFormData) => {
    try {
      setLoading(true);
      const { data: result } = await createCourt(data);
      toaster.success({
        title: 'Quadra adicionada',
        description: `ID da quadra: ${result.id}`,
      });
      store.setOpen(false);
    } catch (error) {
      toaster.error({
        title: 'Erro ao adicionar quadra',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  return <CourtDrawer onSubmit={onSubmit} isLoading={isLoading} title="Adicionar Quadra" />;
};

const CreateCourtDrawer = () => (
  <DrawerRoot size="xl">
    <DrawerContext>{(store) => <CreateCourtDrawerInner store={store} />}</DrawerContext>
  </DrawerRoot>
);
export default CreateCourtDrawer;
