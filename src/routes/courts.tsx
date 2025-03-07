import ConfirmationDialog from '@/components/ConfirmationDialog';
import CreateCourtDrawer from '@/components/courts/CreateCourtDrawer';
import UpdateCourtDrawer from '@/components/courts/UpdateCourtDrawer';
import { toaster } from '@/components/ui/toaster';
import { deleteCourt } from '@/db/court';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { Flex, Text, Table, IconButton, HStack } from '@chakra-ui/react';
import { LuTrash } from 'react-icons/lu';
import { useNavigate } from 'react-router';

const Courts = () => {
  const {
    courts: { list: courts, loading, error },
  } = useGlobalStore();

  const { permissions } = useAuth();
  const navigate = useNavigate();

  if (!permissions.manage_users) {
    navigate('/');
  }

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>Ocorreu um erro ao carregar as quadras</Text>;
  }

  const onDeleteCourt = async (id: string) => {
    try {
      await deleteCourt({ id });
      toaster.success({
        title: 'Quadra excluída',
      });
    } catch (error) {
      toaster.error({
        title: 'Erro ao excluir quadra',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };

  return (
    <Flex gap={4} direction="column" w="100%">
      <HStack justifyContent="space-between">
        <Text fontSize="2xl" mb={4}>
          Quadras
        </Text>
        <CreateCourtDrawer />
      </HStack>
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Nome</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {courts.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell display="flex" gap={2} justifyContent="flex-end">
                <UpdateCourtDrawer court={item} />
                <ConfirmationDialog
                  title="Excluir usuário"
                  description={`Tem certeza que deseja excluir a quadra ${item.name}?`}
                  onConfirm={() => onDeleteCourt(item.id)}
                >
                  <IconButton aria-label="Excluir" variant="outline" size="sm" title="Excluir">
                    <LuTrash />
                  </IconButton>
                </ConfirmationDialog>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default Courts;
