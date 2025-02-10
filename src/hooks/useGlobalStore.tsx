import { Role } from '@/db/role';
import { User } from '@/db/user';
import { createContext, useContext } from 'react';

type GlobalStoreValue = {
  users: { list: User[]; loading: boolean; error: Error | null };
  roles: { list: Role[]; loading: boolean; error: Error | null };
};

export const GlobalStore = createContext<GlobalStoreValue>(undefined as unknown as GlobalStoreValue);

export const useGlobalStore = () => useContext(GlobalStore);
