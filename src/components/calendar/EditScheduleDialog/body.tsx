import { Button, Fieldset, HStack, Input } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';

import { Field } from '@/components/ui/field';
import { FormRow } from '@/components/ui/form-row';
import Form from '@/components/ui/form';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { playerType, publishSchedule, Schedule } from '@/db/schedule';
import UserSelect from '@/components/users/UserSelect';
import { toaster } from '@/components/ui/toaster';
import { useState } from 'react';
import ConfirmationDialog from '@/components/ConfirmationDialog';

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
  onPublished?: () => void;
};

const validatePlayersAmount = (value: string[], type: Schedule['type']) => {
  if (type === 'ranking' && value.length && value.length !== 2) {
    return 'Ranking deve ter 2 jogadores';
  }
  if (type === 'casual' && value.length && value.length !== 1) {
    return 'Bate-bola deve ter 1 jogador';
  }
  return true;
};

const EditScheduleDialogBody = ({
  schedule,
  onSubmit,
  onPublished,
  isLoading,
  portalRef,
}: EditScheduleDialogBodyProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditScheduleDialogForm>({
    defaultValues: {
      id: schedule.id,
      startTime: format(schedule.startDate.toDate(), 'HH:mm'),
      endTime: format(schedule.endDate.toDate(), 'HH:mm'),
      type: schedule.type,
      users: (schedule.users || []).map((user) => user.id),
    },
  });

  const [isPublishing, setIsPublishing] = useState(false);

  const onPublish = async () => {
    try {
      setIsPublishing(true);
      await publishSchedule({ id: schedule.id! });
      toaster.success({
        title: 'Agendamento publicado',
        description: `ID do agendamento: ${schedule.id}`,
      });
      onPublished?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

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
            rules={{ validate: (value) => validatePlayersAmount(value, schedule.type) }}
            render={({ field }) => (
              <UserSelect
                name={field.name}
                value={field.value}
                onValueChange={(ev) => field.onChange(ev.value)}
                placeholder="Jogadores"
                type={[playerType(schedule)]}
                portalRef={portalRef}
                multiple={schedule.type !== 'casual'}
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
      {!schedule.publishedAt && (
        <FormRow justifyContent="center">
          <ConfirmationDialog
            title="Publicar agendamento"
            description="Tem certeza que deseja publicar este agendamento?"
            onConfirm={onPublish}
          >
            <Button type="button" w="100%" loading={isPublishing} disabled={isPublishing} colorPalette="green">
              Publicar
            </Button>
          </ConfirmationDialog>
        </FormRow>
      )}
    </Form>
  );
};

export default EditScheduleDialogBody;
