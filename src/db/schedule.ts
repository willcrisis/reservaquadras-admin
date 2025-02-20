import { functions } from '@/config/firebase';
import { Court } from '@/db/court';
import { DocumentReference } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

export interface Schedule {
  id?: string;
  startDate: Date;
  endDate: Date;
  court: DocumentReference<Court>;
  type: 'ranking' | 'casual';
  createdAt: Date;
  createdBy: string;
}

export interface CreateScheduleInput extends Omit<Schedule, 'id' | 'createdAt' | 'createdBy' | 'court'> {
  courts: string[];
}

export const createSchedule = httpsCallable<Omit<CreateScheduleInput, 'id'>, { id: string }>(
  functions,
  'createSchedule',
);
