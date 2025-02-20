import NavBar from '@/components/nav-bar';
import withGlobalStore from '@/providers/GlobalStore';
import Courts from '@/routes/courts';
import Home from '@/routes/home';
import Users from '@/routes/users';
import { Flex } from '@chakra-ui/react';
import { Route, Routes } from 'react-router';

const RouterComponent = () => (
  <Flex gap={4} direction="column">
    <NavBar />
    <Flex px="4">
      <Routes>
        <Route index element={<Home />} />
        <Route path="users" element={<Users />} />
        <Route path="courts" element={<Courts />} />
      </Routes>
    </Flex>
  </Flex>
);

const Router = withGlobalStore(RouterComponent);

export default Router;
