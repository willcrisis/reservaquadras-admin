import { DrawerRoot } from '@/components/ui/drawer';
import { toaster } from '@/components/ui/toaster';
import UserDrawer, { UserFormData } from '@/components/users/UserDrawer';
import { createUser } from '@/db/user';
import { DrawerContext, UseDialogReturn } from '@chakra-ui/react';
import { useState } from 'react';

const CreateUserDrawerInner = ({ store }: { store: UseDialogReturn }) => {
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);
      const { data: result } = await createUser({ ...data, countryCode: data.countryCode[0] });
      toaster.success({
        title: 'Usuário adicionado',
        description: `ID do usuário: ${result.id}`,
      });
      store.setOpen(false);
    } catch (error) {
      toaster.error({
        title: 'Erro ao adicionar usuário',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  return <UserDrawer onSubmit={onSubmit} isLoading={isLoading} />;
};

const CreateUserDrawer = () => (
  <DrawerRoot size="xl">
    <DrawerContext>{(store) => <CreateUserDrawerInner store={store} />}</DrawerContext>
  </DrawerRoot>
);
export default CreateUserDrawer;
