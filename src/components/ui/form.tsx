import { chakra } from '@chakra-ui/react';

const Form = chakra('form', {
  base: {
    w: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
});

export default Form;
