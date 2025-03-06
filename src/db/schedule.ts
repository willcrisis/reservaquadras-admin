import { functions } from '@/config/firebase';
import { Court } from '@/db/court';
import { useCollectionRealtimeData } from '@/hooks/firebase';
import { DocumentReference, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useMemo } from 'react';

export const SCHEDULES_COLLECTION = 'schedules';
export interface Schedule {
  id?: string;
  startDate: Date;
  endDate: Date;
  court: DocumentReference<Court>;
  type: 'ranking' | 'casual';
  createdAt: Date;
  createdBy: string;
}

export const useSchedules = (type: 'ranking' | 'casual', startDate: Date, endDate: Date) => {
  const queries = useMemo(
    () => [where('startDate', '>=', startDate.getTime()), where('endDate', '<=', endDate.getTime())],
    [type, startDate, endDate],
  );

  return useCollectionRealtimeData<Schedule>(type, queries);
};

export interface CreateScheduleInput {
  courts: string[];
  startDate: number;
  endDate: number;
  type: 'ranking' | 'casual';
}

export const createSchedule = httpsCallable<Omit<CreateScheduleInput, 'id'>, { id: string }>(
  functions,
  'createSchedule',
);
