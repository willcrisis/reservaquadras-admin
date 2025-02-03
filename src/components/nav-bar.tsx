import UserMenu from '@/components/user-menu';
import { Heading, HStack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type NavBarProps = {
  title?: string;
};

const NavBar = ({ title, children }: PropsWithChildren<NavBarProps>) => (
  <HStack px="4" py="2" borderBottomWidth="1px" borderColor="gray.200">
    {title && <Heading>Agenda</Heading>}
    <HStack flex="1" justifyContent="flex-end" alignItems="center" gap="4">
      {children}
      <UserMenu />
    </HStack>
  </HStack>
);

export default NavBar;
