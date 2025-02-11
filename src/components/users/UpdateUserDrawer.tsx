import { DrawerRoot } from '@/components/ui/drawer';
import { toaster } from '@/components/ui/toaster';
import UserDrawer, { UserFormData } from '@/components/users/UserDrawer';
import { updateUser, User } from '@/db/user';
import { DrawerContext, IconButton, UseDialogReturn } from '@chakra-ui/react';
import { useState } from 'react';
import { LuPencil } from 'react-icons/lu';

const UpdateUserDrawerInner = ({ store, user }: { store: UseDialogReturn; user: User }) => {
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);
      const { data: result } = await updateUser({ ...data, id: data.id!, countryCode: data.countryCode[0] });
      toaster.success({
        title: 'Usuário atualizado',
        description: `ID do usuário: ${result.id}`,
      });
      store.setOpen(false);
    } catch (error) {
      toaster.error({
        title: 'Erro ao atualizar usuário',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserDrawer
      onSubmit={onSubmit}
      isLoading={isLoading}
      title="Editar Usuário"
      trigger={
        <IconButton aria-label="Editar" variant="outline" size="sm" title="Editar">
          <LuPencil />
        </IconButton>
      }
      user={user}
    />
  );
};

const UpdateUserDrawer = ({ user }: { user: User }) => (
  <DrawerRoot size="xl">
    <DrawerContext>{(store) => <UpdateUserDrawerInner store={store} user={user} />}</DrawerContext>
  </DrawerRoot>
);
export default UpdateUserDrawer;
