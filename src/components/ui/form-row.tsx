import { HStack, StackProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type Props = Omit<StackProps, 'gap' | 'w'> & {
  label?: string;
};

export const FormRow = ({ children, ...props }: PropsWithChildren<Props>) => (
  <HStack {...props} gap={2} w="100%">
    {children}
  </HStack>
);
