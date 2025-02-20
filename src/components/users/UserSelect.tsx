import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { createListCollection, SelectRootProps, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

type UserSelectProps = {
  contentRef?: React.RefObject<HTMLDivElement>;
  type?: ('ranking' | 'player' | 'admin' | 'sudo')[];
} & Omit<SelectRootProps, 'collection'>;

const UserSelect = ({ contentRef, type = ['player'], ...props }: UserSelectProps) => {
  const {
    users: { list: users, loading },
  } = useGlobalStore();

  const userOptions = useMemo(
    () =>
      createListCollection({
        items: users
          .filter((user) => type.some((t) => user.roles.includes(t)))
          .map(({ id: value, name: label }) => ({ label, value })),
      }),
    [users, type],
  );

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <SelectRoot {...props} collection={userOptions}>
      <SelectTrigger>
        <SelectValueText placeholder="Selecione o usuário" />
      </SelectTrigger>
      <SelectContent portalRef={contentRef}>
        {userOptions.items.map((user) => (
          <SelectItem key={user.value} item={user}>
            {user.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default UserSelect;
