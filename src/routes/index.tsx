import UsersCollection from '@/db/user';
import { useFirebase } from '@/providers/FirebaseProvider';
import { Button, Flex } from '@chakra-ui/react';
import { useEffect } from 'react';

const Home = () => {
  const { logout } = useFirebase();
  useEffect(() => {
    UsersCollection.list().then((users) => {
      console.log(users);
    });
  }, []);
  return (
    <Flex gap={4} direction="column" alignItems="center" justifyContent="center" h="100vh" px="8">
      <h1>Home</h1>
      <Button onClick={logout}>Logout</Button>
    </Flex>
  );
};

export default Home;
