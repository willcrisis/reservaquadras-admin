export const ROLES_COLLECTION = 'roles';

export interface Role {
  id: string;
  name: string;
  description: string;
  order: number;
}
