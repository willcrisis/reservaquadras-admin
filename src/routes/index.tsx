import NavBar from '@/components/nav-bar';
import { useAuth } from '@/hooks/useAuth';
import { Button, Flex } from '@chakra-ui/react';

const Home = () => {
  const { permissions } = useAuth();
  return (
    <Flex gap={4} direction="column">
      <NavBar title="Agenda">
        {permissions.manage_schedules && <Button size="sm">Liberar Quadras</Button>}
        {permissions.manage_users && <Button size="sm">Gerenciar Usuários</Button>}
      </NavBar>
    </Flex>
  );
};

export default Home;
