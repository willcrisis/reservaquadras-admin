import {
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Field } from '@/components/ui/field';
import Form from '@/components/ui/form';
import { FormRow } from '@/components/ui/form-row';
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select';
import { User } from '@/db/user';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { Button, createListCollection, Input } from '@chakra-ui/react';
import { useMemo, useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

export type UserFormData = {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  roles: string[];
};

export interface UserDrawerProps {
  user?: User;
  onSubmit: SubmitHandler<UserFormData>;
  isLoading?: boolean;
}

const UserDrawer = ({ user, isLoading, onSubmit }: UserDrawerProps) => {
  if (!onSubmit) {
    throw new Error('onSubmit is required');
  }

  const {
    roles: { list: roles },
  } = useGlobalStore();

  const rolesOptions = useMemo(
    () => createListCollection({ items: roles.map((role) => ({ label: role.name, value: role.id })) }),
    [roles],
  );

  const {
    control,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<UserFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      roles: user?.roles || [],
    },
  });

  const values = watch();

  const validation = useMemo(
    () => ({
      name: { required: true },
      email: { required: ['sudo', 'admin'].some((role) => values.roles.includes(role)) },
      phoneNumber: { required: ['player', 'ranking'].some((role) => values.roles.includes(role)) },
      roles: { required: true },
    }),
    [values.roles],
  );

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button>{user ? 'Editar' : 'Adicionar'} Usuário</Button>
      </DrawerTrigger>
      <DrawerContent ref={contentRef}>
        <DrawerHeader>
          <DrawerTitle>Adicionar Usuário</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Form onSubmit={handleSubmit(onSubmit)} gap={4}>
            <FormRow>
              <Field label="Nome" required={validation.name.required}>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: validation.name.required }}
                  render={({ field }) => <Input {...field} />}
                />
              </Field>
              <Field label="Cargos" required={validation.roles.required}>
                <Controller
                  control={control}
                  name="roles"
                  rules={{ required: validation.roles.required }}
                  render={({ field }) => (
                    <SelectRoot
                      name={field.name}
                      value={field.value}
                      multiple
                      collection={rolesOptions}
                      onValueChange={(ev) => field.onChange(ev.value)}
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Selecione as permissões" />
                      </SelectTrigger>
                      <SelectContent portalRef={contentRef}>
                        {rolesOptions.items.map((role) => (
                          <SelectItem key={role.value} item={role}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </Field>
            </FormRow>
            <FormRow>
              {['sudo', 'admin'].some((role) => values.roles.includes(role)) && (
                <Field
                  label="Email"
                  invalid={!!errors.email}
                  required={['sudo', 'admin'].some((role) => values.roles.includes(role))}
                >
                  <Controller
                    control={control}
                    name="email"
                    rules={{ required: ['sudo', 'admin'].some((role) => values.roles.includes(role)) }}
                    render={({ field }) => <Input type="email" {...field} />}
                  />
                </Field>
              )}
              {['player', 'ranking'].some((role) => values.roles.includes(role)) && (
                <Field
                  label="Telefone"
                  invalid={!!errors.phoneNumber}
                  required={['player', 'ranking'].some((role) => values.roles.includes(role))}
                >
                  <Controller
                    control={control}
                    name="phoneNumber"
                    rules={{ required: ['player', 'ranking'].some((role) => values.roles.includes(role)) }}
                    render={({ field }) => <Input {...field} />}
                  />
                </Field>
              )}
            </FormRow>
            <FormRow justifyContent="center">
              <Button type="submit" colorScheme="blue" loading={isLoading} disabled={isLoading}>
                {user ? 'Salvar' : 'Adicionar'}
              </Button>
            </FormRow>
          </Form>
        </DrawerBody>
      </DrawerContent>
    </>
  );
};

export default UserDrawer;
