import { Button, createListCollection } from '@chakra-ui/react';

import { Field } from '@/components/ui/field';
import Form from '@/components/ui/form';
import { FormRow } from '@/components/ui/form-row';
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select';
import { Input } from '@chakra-ui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@/db/user';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { useMemo } from 'react';
import CountryCodeSelect from '@/components/CountryCodeSelect';

export type UserFormData = {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string[];
  roles: string[];
};

export interface UserDrawerBodyProps {
  user?: User;
  isLoading?: boolean;
  onSubmit: SubmitHandler<UserFormData>;
}

const UserDrawerBody = ({
  user,
  isLoading,
  onSubmit,
  contentRef,
}: UserDrawerBodyProps & { contentRef: React.RefObject<HTMLDivElement> }) => {
  if (!onSubmit) {
    throw new Error('onSubmit is required');
  }

  const {
    roles: { list: roles },
  } = useGlobalStore();

  const {
    control,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<UserFormData>({
    defaultValues: {
      id: user?.id,
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      countryCode: user?.countryCode ? [user.countryCode] : ['55'],
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
      sudo: { disabled: values.roles.includes('admin') },
      admin: { disabled: values.roles.includes('sudo') },
    }),
    [values.roles],
  );

  const rolesOptions = useMemo(
    () =>
      createListCollection({
        items: roles.map((role) => ({
          label: role.name,
          value: role.id,
          disabled:
            role.id === 'sudo' ? validation.sudo?.disabled : role.id === 'admin' ? validation.admin?.disabled : false,
        })),
      }),
    [roles, validation],
  );

  return (
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
        <Field label="Permissões" required={validation.roles.required}>
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
      {validation.phoneNumber.required && (
        <FormRow>
          <Field label="País" invalid={!!errors.phoneNumber} required={validation.phoneNumber.required}>
            <Controller
              control={control}
              name="countryCode"
              rules={{ required: validation.phoneNumber.required }}
              render={({ field }) => <CountryCodeSelect field={field} portalRef={contentRef} />}
            />
          </Field>
          <Field label="Telefone" invalid={!!errors.phoneNumber} required={validation.phoneNumber.required}>
            <Controller
              control={control}
              name="phoneNumber"
              rules={{ required: validation.phoneNumber.required }}
              render={({ field }) => <Input {...field} type="number" maxLength={15} />}
            />
          </Field>
        </FormRow>
      )}
      {validation.email.required && (
        <FormRow>
          <Field label="Email" invalid={!!errors.email} required={validation.email.required}>
            <Controller
              control={control}
              name="email"
              rules={{ required: validation.email.required }}
              render={({ field }) => <Input type="email" {...field} />}
            />
          </Field>
        </FormRow>
      )}
      <FormRow justifyContent="center">
        <Button type="submit" colorScheme="blue" loading={isLoading} disabled={isLoading}>
          Salvar
        </Button>
      </FormRow>
    </Form>
  );
};

export default UserDrawerBody;
