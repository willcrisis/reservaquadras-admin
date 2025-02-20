import { functions } from '@/config/firebase';
import { httpsCallable } from 'firebase/functions';

export const COURTS_COLLECTION = 'courts';

export interface Court {
  id: string;
  name: string;
}

export const createCourt = httpsCallable<Omit<Court, 'id'>, { id: string }>(functions, 'createCourt');
export const updateCourt = httpsCallable<Court, { id: string }>(functions, 'updateCourt');
export const deleteCourt = httpsCallable<{ id: string }, { id: string }>(functions, 'deleteCourt');
