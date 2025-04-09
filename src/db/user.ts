import { functions } from '@/config/firebase';
import { httpsCallable } from 'firebase/functions';

export const USERS_COLLECTION = 'users';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  roles: string[];
  photoURL?: string;
}

export const createUser = httpsCallable<Omit<User, 'id'>, { id: string }>(functions, 'createUser');
export const updateUser = httpsCallable<User, { id: string }>(functions, 'updateUser');
export const deleteUser = httpsCallable<{ id: string }, { id: string }>(functions, 'deleteUser');
export const createTestUsers = httpsCallable<{ count: number }, { success: number }>(functions, 'createTestUsers');
