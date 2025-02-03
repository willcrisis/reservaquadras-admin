import { Role } from '@/db/role';
import { DocumentReference } from 'firebase/firestore';

export const USERS_COLLECTION = 'users';

export interface User {
  id: string;
  name: string;
  role: DocumentReference<Role>;
}
