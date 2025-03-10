import { Avatar } from '@/components/ui/avatar';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu';
import { useAuth } from '@/hooks/useAuth';

const UserMenu = () => {
  const { user, logout } = useAuth();

  return (
    <MenuRoot>
      <MenuTrigger>
        <Avatar name={user!.displayName!} src={user!.photoURL!} />
      </MenuTrigger>
      <MenuContent zIndex={1100}>
        <MenuItem value="logout" onClick={logout}>
          Sair
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};

export default UserMenu;
