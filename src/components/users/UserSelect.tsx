import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { createListCollection, SelectRootProps, Text } from '@chakra-ui/react';
import { forwardRef, useMemo } from 'react';

type UserSelectProps = {
  type?: ('ranking' | 'player' | 'admin' | 'sudo')[];
  placeholder?: string;
  portalRef?: React.RefObject<HTMLDivElement>;
} & Omit<SelectRootProps, 'collection'>;

const UserSelect = forwardRef<HTMLDivElement, UserSelectProps>(
  ({ type = ['player'], placeholder = 'Selecione o usuário', portalRef, ...props }, ref) => {
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
      <SelectRoot {...props} collection={userOptions} ref={ref}>
        <SelectTrigger clearable>
          <SelectValueText placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent portalRef={portalRef}>
          {userOptions.items.map((user) => (
            <SelectItem key={user.value} item={user}>
              {user.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    );
  },
);

export default UserSelect;
