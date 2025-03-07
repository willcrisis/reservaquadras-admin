import { Button, CheckboxGroup, Fieldset, HStack, Input } from '@chakra-ui/react';
import { format, setHours } from 'date-fns';
import { Controller, useController, useForm } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { FormRow } from '@/components/ui/form-row';
import Form from '@/components/ui/form';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { useMemo } from 'react';
import { useGlobalStore } from '@/hooks/useGlobalStore';

export type ScheduleAllDayDialogForm = {
  startTime: string;
  endTime: string;
  courts: string[];
  interval: number;
  type: 'casual' | 'ranking';
};

type ScheduleAllDayDialogBodyProps = {
  date: Date;
  onSubmit: (data: ScheduleAllDayDialogForm) => void;
  isLoading?: boolean;
};

const ScheduleAllDayDialogBody = ({ date, onSubmit, isLoading }: ScheduleAllDayDialogBodyProps) => {
  const {
    courts: { list: courts },
  } = useGlobalStore();

  const courtOptions = useMemo(() => courts.map(({ id: value, name: label }) => ({ label, value })), [courts]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ScheduleAllDayDialogForm>({
    defaultValues: {
      startTime: format(setHours(date, 9), 'HH:mm'),
      endTime: format(setHours(date, 17), 'HH:mm'),
      courts: [],
      interval: 60,
      type: 'casual',
    },
  });

  const courtsController = useController({
    control,
    name: 'courts',
    defaultValue: [],
    rules: {
      required: 'Selecione pelo menos uma quadra',
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
        <Field label="Duração (minutos)" required>
          <Input {...register('interval', { required: true })} type="number" />
        </Field>
      </FormRow>
      <FormRow>
        <Fieldset.Root invalid={!!errors.courts}>
          <Fieldset.Legend>Quadras</Fieldset.Legend>
          <CheckboxGroup
            value={courtsController.field.value}
            onValueChange={courtsController.field.onChange}
            name={courtsController.field.name}
          >
            <Fieldset.Content>
              {courtOptions.map((c) => (
                <Checkbox key={c.value} value={c.value}>
                  {c.label}
                </Checkbox>
              ))}
            </Fieldset.Content>
          </CheckboxGroup>
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

export default ScheduleAllDayDialogBody;
