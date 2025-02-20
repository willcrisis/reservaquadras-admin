import { Button, CheckboxGroup, Fieldset, HStack, Input, Text } from '@chakra-ui/react';
import { addMinutes, format, setHours, setMinutes } from 'date-fns';
import { Controller, useController, useForm } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { FormRow } from '@/components/ui/form-row';
import Form from '@/components/ui/form';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { useCollectionRealtimeData } from '@/hooks/firebase';
import { Court, COURTS_COLLECTION } from '@/db/court';
import { useMemo } from 'react';

export type SchedulePopoverForm = {
  startTime: string;
  endTime: string;
  courts: string[];
  type: 'casual' | 'ranking';
};

type SchedulePopoverBodyProps = {
  date: Date;
  hour: number;
  half?: boolean;
  onSubmit: (data: SchedulePopoverForm) => void;
  isLoading?: boolean;
};

const SchedulePopoverBody = ({ date, hour, half, onSubmit, isLoading }: SchedulePopoverBodyProps) => {
  const [courts, { loading }] = useCollectionRealtimeData<Court>(COURTS_COLLECTION);
  const courtOptions = useMemo(() => courts.map(({ id: value, name: label }) => ({ label, value })), [courts]);

  const startHour = setMinutes(setHours(date, hour), half ? 30 : 0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SchedulePopoverForm>({
    defaultValues: {
      startTime: format(startHour, 'HH:mm'),
      endTime: format(addMinutes(startHour, 90), 'HH:mm'),
      courts: [],
      type: 'ranking',
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

  if (loading) {
    return <Text>Carregando...</Text>;
  }

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

export default SchedulePopoverBody;
