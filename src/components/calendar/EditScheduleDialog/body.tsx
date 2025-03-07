import { Button, Fieldset, HStack, Input } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';

import { Field } from '@/components/ui/field';
import { FormRow } from '@/components/ui/form-row';
import Form from '@/components/ui/form';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { Schedule } from '@/db/schedule';
import UserSelect from '@/components/users/UserSelect';

export type EditScheduleDialogForm = {
  id: string;
  startTime: string;
  endTime: string;
  type: 'ranking' | 'casual';
  users: string[];
};

type EditScheduleDialogBodyProps = {
  schedule: Schedule;
  onSubmit: (data: EditScheduleDialogForm) => void;
  isLoading?: boolean;
  portalRef?: React.RefObject<HTMLDivElement>;
};

const EditScheduleDialogBody = ({ schedule, onSubmit, isLoading, portalRef }: EditScheduleDialogBodyProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditScheduleDialogForm>({
    defaultValues: {
      id: schedule.id,
      startTime: format(schedule.startDate, 'HH:mm'),
      endTime: format(schedule.endDate, 'HH:mm'),
      type: schedule.type,
      users: (schedule.users || []).map((user) => user.id),
    },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <Fieldset.Root>
          <Fieldset.Legend>Tipo</Fieldset.Legend>
          <Controller
            control={control}
            name="type"
            rules={{ required: true }}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={({ value }) => field.onChange(value)} name={field.name}>
                <HStack gap={8}>
                  <Radio value="ranking">Ranking</Radio>
                  <Radio value="casual">Bate Bola</Radio>
                </HStack>
              </RadioGroup>
            )}
          />
        </Fieldset.Root>
      </FormRow>
      <FormRow>
        <Field label="Início" required>
          <Input {...register('startTime', { required: true })} type="time" />
        </Field>
        <Field label="Fim" required>
          <Input {...register('endTime', { required: true })} type="time" />
        </Field>
      </FormRow>
      <FormRow>
        <Field label="Jogadores" invalid={!!errors.users} errorText={errors.users?.message}>
          <Controller
            control={control}
            name="users"
            rules={{ validate: (value) => (value.length > 2 ? 'Máximo de 2 jogadores' : true) }}
            render={({ field }) => (
              <UserSelect
                name={field.name}
                value={field.value}
                onValueChange={(ev) => field.onChange(ev.value)}
                placeholder="Selecione os jogadores"
                type={[schedule.type === 'casual' ? 'player' : schedule.type]}
                portalRef={portalRef}
                multiple
              />
            )}
          />
        </Field>
      </FormRow>
      <FormRow justifyContent="center">
        <Button type="submit" w="100%" loading={isLoading} disabled={isLoading}>
          Salvar
        </Button>
      </FormRow>
    </Form>
  );
};

export default EditScheduleDialogBody;
