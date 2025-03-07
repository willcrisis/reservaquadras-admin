import { functions } from '@/config/firebase';
import { Court } from '@/db/court';
import { User } from '@/db/user';
import { useCollectionRealtimeData } from '@/hooks/firebase';
import { differenceInMinutes } from 'date-fns';
import { DocumentReference, getDoc, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useMemo } from 'react';

export const SCHEDULES_COLLECTION = 'schedules';
export interface Schedule {
  id?: string;
  startDate: Date;
  endDate: Date;
  publishedAt: Date;
  court: DocumentReference<Court>;
  type: 'ranking' | 'casual';
  users: DocumentReference<User>[];
  createdAt: Date;
  createdBy: string;
}

export const useSchedules = (startDate: Date, endDate: Date) => {
  const queries = useMemo(
    () => [where('startDate', '>=', startDate.getTime()), where('endDate', '<=', endDate.getTime())],
    [startDate, endDate],
  );

  return useCollectionRealtimeData<Schedule>(SCHEDULES_COLLECTION, queries);
};

export interface CreateScheduleInput {
  courts: string[];
  startDate: number;
  endDate: number;
  type: 'ranking' | 'casual';
}

export type CreateScheduleOutput = { success: number };

export const createSchedule = httpsCallable<Omit<CreateScheduleInput, 'id'>, CreateScheduleOutput>(
  functions,
  'createSchedule',
);

export const createAllDaySchedule = httpsCallable<
  Omit<CreateScheduleInput & { interval: number }, 'id'>,
  CreateScheduleOutput
>(functions, 'createAllDaySchedule');

export interface UpdateScheduleInput {
  id: string;
  startDate: number;
  endDate: number;
  type: 'ranking' | 'casual';
  users: string[];
}

export type UpdateScheduleOutput = { id: string };

export const updateSchedule = httpsCallable<UpdateScheduleInput, UpdateScheduleOutput>(functions, 'updateSchedule');

export const scheduleDuration = (schedule: Schedule) => differenceInMinutes(schedule.endDate, schedule.startDate);

export const court = async (schedule: Schedule) => {
  const doc = await getDoc(schedule.court);
  return doc.data()?.name;
};

export const typeName = ({ type }: Schedule) => (type === 'casual' ? 'Bate-bola' : type);
export const playerType = ({ type }: Schedule) => (type === 'casual' ? 'player' : type);
