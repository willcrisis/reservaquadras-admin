import ConfirmationDialog from '@/components/ConfirmationDialog';
import { toaster } from '@/components/ui/toaster';
import CreateUserDrawer from '@/components/users/CreateUserDrawer';
import UpdateUserDrawer from '@/components/users/UpdateUserDrawer';
import { deleteUser } from '@/db/user';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { Flex, Text, Table, IconButton, HStack } from '@chakra-ui/react';
import { LuTrash } from 'react-icons/lu';
import { useNavigate } from 'react-router';

const Users = () => {
  const {
    roles: { list: roles, loading: loadingRoles, error: errorRoles },
    users: { list: users, loading: loadingUsers, error: errorUsers },
  } = useGlobalStore();

  const { permissions, user } = useAuth();
  const navigate = useNavigate();

  if (!permissions.manage_users) {
    navigate('/');
  }

  if (loadingUsers || loadingRoles) {
    return <Text>Carregando...</Text>;
  }

  if (errorUsers || errorRoles) {
    return <Text>Ocorreu um erro ao carregar os usuários</Text>;
  }

  const onDeleteUser = async (id: string) => {
    try {
      await deleteUser({ id });
      toaster.success({
        title: 'Usuário excluído com sucesso',
      });
    } catch (error) {
      toaster.error({
        title: 'Erro ao excluir usuário',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };

  return (
    <Flex gap={4} direction="column" w="100%">
      <HStack justifyContent="space-between">
        <Text fontSize="2xl" mb={4}>
          Usuários
        </Text>
        <CreateUserDrawer />
      </HStack>
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Nome</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Telefone</Table.ColumnHeader>
            <Table.ColumnHeader>Permissões</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>
                {item.phoneNumber && (
                  <>
                    +{item.countryCode} {item.phoneNumber}
                  </>
                )}
              </Table.Cell>
              <Table.Cell>{item.roles?.map((role) => roles.find((r) => r.id === role)?.name).join(', ')}</Table.Cell>
              <Table.Cell display="flex" gap={2} justifyContent="flex-end">
                <UpdateUserDrawer user={item} />
                {item.id !== user?.uid && (
                  <ConfirmationDialog
                    title="Excluir usuário"
                    description={`Tem certeza que deseja excluir o usuário ${item.name}?`}
                    onConfirm={() => onDeleteUser(item.id)}
                  >
                    <IconButton aria-label="Excluir" variant="outline" size="sm" title="Excluir">
                      <LuTrash />
                    </IconButton>
                  </ConfirmationDialog>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default Users;
