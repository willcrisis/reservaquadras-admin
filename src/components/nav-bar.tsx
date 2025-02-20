import UserMenu from '@/components/user-menu';
import { useAuth } from '@/hooks/useAuth';
import { Heading, HStack, Link } from '@chakra-ui/react';
import { NavLink } from 'react-router';

const NavBar = () => {
  const { permissions } = useAuth();

  return (
    <nav>
      <HStack px="4" py="2" borderBottomWidth="1px" borderColor="gray.200">
        <Heading>Reserva de Quadras</Heading>
        <HStack flex="1" justifyContent="flex-end" alignItems="center" gap="16">
          {permissions.manage_schedules && (
            <Link asChild>
              <NavLink to="/">Calendário</NavLink>
            </Link>
          )}
          {permissions.manage_users && (
            <Link asChild>
              <NavLink to="/users">Usuários</NavLink>
            </Link>
          )}
          {permissions.manage_users && (
            <Link asChild>
              <NavLink to="/courts">Quadras</NavLink>
            </Link>
          )}
          <UserMenu />
        </HStack>
      </HStack>
    </nav>
  );
};

export default NavBar;
