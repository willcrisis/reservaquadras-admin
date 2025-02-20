import { Button } from '@chakra-ui/react';

import { Field } from '@/components/ui/field';
import Form from '@/components/ui/form';
import { FormRow } from '@/components/ui/form-row';
import { Input } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Court } from '@/db/court';

export type CourtFormData = {
  id?: string;
  name: string;
};

export interface CourtDrawerBodyProps {
  court?: Court;
  isLoading?: boolean;
  onSubmit: SubmitHandler<CourtFormData>;
}

const CourtDrawerBody = ({ court, isLoading, onSubmit }: CourtDrawerBodyProps) => {
  if (!onSubmit) {
    throw new Error('onSubmit is required');
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CourtFormData>({
    defaultValues: {
      id: court?.id,
      name: court?.name || '',
    },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} gap={4}>
      <FormRow>
        <Field label="Nome" required invalid={!!errors.name}>
          <Input {...register('name', { required: true })} />
        </Field>
      </FormRow>
      <FormRow justifyContent="center">
        <Button type="submit" colorScheme="blue" loading={isLoading} disabled={isLoading}>
          Salvar
        </Button>
      </FormRow>
    </Form>
  );
};

export default CourtDrawerBody;
