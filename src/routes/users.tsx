import CreateUserDrawer from '@/components/users/CreateUserDrawer';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { Flex, Text, Table, IconButton, HStack } from '@chakra-ui/react';
import { LuPencil, LuTrash } from 'react-icons/lu';
import { useNavigate } from 'react-router';

const Users = () => {
  const {
    users: { list, loading, error },
    roles: { list: roles, loading: loadingRoles, error: errorRoles },
  } = useGlobalStore();

  const { permissions, user } = useAuth();
  const navigate = useNavigate();

  if (!permissions.manage_users) {
    navigate('/');
  }

  if (loading || loadingRoles) {
    return <Text>Carregando...</Text>;
  }

  if (error || errorRoles) {
    return <Text>Ocorreu um erro ao carregar os usuários</Text>;
  }

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
          {list.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.phoneNumber}</Table.Cell>
              <Table.Cell>{item.roles?.map((role) => roles.find((r) => r.id === role)?.name).join(', ')}</Table.Cell>
              <Table.Cell display="flex" gap={2} justifyContent="flex-end">
                <IconButton aria-label="Editar" variant="outline" size="sm" title="Editar">
                  <LuPencil />
                </IconButton>
                {item.id !== user?.uid && (
                  <IconButton aria-label="Excluir" variant="outline" size="sm" title="Excluir">
                    <LuTrash />
                  </IconButton>
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
