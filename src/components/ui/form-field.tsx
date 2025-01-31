import { FieldLabel, VStack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type Props = {
  label?: string;
};

export const FormField = ({ label, children }: PropsWithChildren<Props>) => (
  <VStack alignItems="flex-start" flex={1}>
    {label && <FieldLabel fontSize="sm">{label}</FieldLabel>}
    {children}
  </VStack>
);
