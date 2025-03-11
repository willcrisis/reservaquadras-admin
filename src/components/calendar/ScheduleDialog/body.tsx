import { Button, CheckboxGroup, Fieldset, HStack, Input } from '@chakra-ui/react';
import { addMinutes, format } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { FormRow } from '@/components/ui/form-row';
import Form from '@/components/ui/form';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { useMemo } from 'react';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { Schedule } from '@/db/schedule';

export type ScheduleDialogForm = {
  startTime: string;
  endTime: string;
  courts: string[];
  type: 'casual' | 'ranking';
};

type ScheduleDialogBodyProps = {
  date: Date;
  onSubmit: (data: ScheduleDialogForm) => void;
  isLoading?: boolean;
  type: Schedule['type'];
};

const ScheduleDialogBody = ({ date, onSubmit, isLoading, type }: ScheduleDialogBodyProps) => {
  const {
    courts: { list: courts },
  } = useGlobalStore();
  const courtOptions = useMemo(() => courts.map(({ id: value, name: label }) => ({ label, value })), [courts]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ScheduleDialogForm>({
    defaultValues: {
      startTime: format(date, 'HH:mm'),
      endTime: format(addMinutes(date, 90), 'HH:mm'),
      courts: [],
      type,
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
        <Fieldset.Root invalid={!!errors.courts}>
          <Fieldset.Legend>Quadras</Fieldset.Legend>
          <Controller
            control={control}
            name="courts"
            rules={{ required: 'Selecione pelo menos uma quadra' }}
            defaultValue={[]}
            render={({ field }) => (
              <CheckboxGroup value={field.value} onValueChange={field.onChange} name={field.name}>
                <Fieldset.Content>
                  {courtOptions.map((c) => (
                    <Checkbox key={c.value} value={c.value}>
                      {c.label}
                    </Checkbox>
                  ))}
                </Fieldset.Content>
              </CheckboxGroup>
            )}
          />
          {errors.courts && <Fieldset.ErrorText>{errors.courts.message}</Fieldset.ErrorText>}
        </Fieldset.Root>
      </FormRow>
      <FormRow justifyContent="center">
        <Button type="submit" w="100%" loading={isLoading} disabled={isLoading}>
          Salvar
        </Button>
      </FormRow>
    </Form>
  );
};

export default ScheduleDialogBody;
