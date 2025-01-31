import { Field } from '@/components/ui/field';
import Form from '@/components/ui/form';
import { FormRow } from '@/components/ui/form-row';
import { toaster } from '@/components/ui/toaster';
import { useFirebase } from '@/providers/FirebaseProvider';
import { Button, Flex, Input, VStack } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';

type FormData = {
  email: string;
};

const Login = () => {
  const { authenticate } = useFirebase();

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { email: localStorage.getItem('emailForSignIn') || '' },
  });

  const onSubmit = async ({ email }: FormData) => {
    try {
      localStorage.setItem('emailForSignIn', email);
      await authenticate(email);
      toaster.create({ title: 'Email sent', description: 'Check your email to sign in.', type: 'success' });
    } catch (error) {
      console.error(error);
      toaster.create({ title: 'Error', description: 'An error occurred while sending the email.', type: 'error' });
    }
  };

  return (
    <Flex gap={4} direction="column" alignItems="center" justifyContent="center" h="100vh" px="8">
      <Form onSubmit={handleSubmit(onSubmit)} w={{ md: '40%' }}>
        <VStack alignItems="flex-start" gap={3}>
          <FormRow>
            <Controller
              control={control}
              name="email"
              rules={{ required: 'Campo obrigatório' }}
              render={({ field }) => (
                <Field label="Email" {...field}>
                  <Input type="email" />
                </Field>
              )}
            />
          </FormRow>
          <FormRow justifyContent="center">
            <Button colorScheme="success" type="submit">
              Login
            </Button>
          </FormRow>
        </VStack>
      </Form>
    </Flex>
  );
};

export default Login;
