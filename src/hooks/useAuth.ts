import { User } from 'firebase/auth';
import { createContext, useContext } from 'react';

export type Permissions = {
  manage_schedules: boolean;
  manage_users: boolean;
};

type AuthContextValue = {
  user: User | null;
  roles: string[];
  permissions: Permissions;
  loading: boolean;
  authing: boolean;
  authenticate: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};
export const AuthContext = createContext<AuthContextValue>(undefined as unknown as AuthContextValue);

export const useAuth = () => useContext(AuthContext);
