import { HttpsError, onCall } from "firebase-functions/https";
import { checkPermissions } from "./utils/auth";
import { FieldPath, getFirestore } from "firebase-admin/firestore";
import { buildRange, checkClash } from "./utils/schedule";

export const createSchedule = onCall(async (request) => {
  const userRef = await checkPermissions(request, ['sudo', 'admin']);

  const { startDate, endDate, courts, type } = request.data;
  
  const collection = getFirestore().collection('schedules');

  const schedules = await Promise.all(courts.map(async (court: string) => {
    const courtRef = getFirestore().collection('courts').doc(court);
    
    const courtDoc = await courtRef.get();
    if (!courtDoc.exists) {
      throw new Error('Court not found');
    }

    await checkClash(collection, startDate, endDate, courtRef);
    
    await collection.add({
      startDate,
      endDate,
      court: courtRef,
      type,
      createdBy: userRef,
      createdAt: new Date(),
    });
  }));

  return { success: schedules.length };
});

export const createAllDaySchedule = onCall(async (request) => {
  const userRef = await checkPermissions(request, ['sudo', 'admin']);

  const { startDate, endDate, courts, type, interval } = request.data;

  const collection = getFirestore().collection('schedules');

  const range = buildRange(startDate, endDate, interval);

  const schedules = await Promise.all(courts.map(async (court: string) => {
    const courtRef = getFirestore().collection('courts').doc(court);
    
    const courtDoc = await courtRef.get();
    if (!courtDoc.exists) {
      throw new Error('Court not found');
    }

    await checkClash(collection, startDate, endDate, courtRef);

    await Promise.all(range.map(async (range) => {
      await collection.add({
        startDate: range.start.getTime(),
        endDate: range.end.getTime(),
        type,
        court: courtRef,
        createdBy: userRef,
        createdAt: new Date(),
      });
    }));
  }));

  return { success: schedules.length };
});

export const updateSchedule = onCall(async (request) => {
  const userRef = await checkPermissions(request, ['sudo', 'admin']);

  const { id, startDate, endDate, type, users } = request.data;
  console.log('id', id);
  
  const collection = getFirestore().collection('schedules');

  const scheduleRef = collection.doc(id);

  const scheduleDoc = await scheduleRef.get();
  if (!scheduleDoc.exists) {
    throw new HttpsError('not-found', 'Agendamento não encontrado');
  }

  const schedule = scheduleDoc.data();

  await checkClash(collection, startDate, endDate, schedule!.court, id);

  const usersRef = getFirestore().collection('users').where(FieldPath.documentId(), 'in', users);
  
  const usersDoc = await usersRef.get();
  console.log('usersDoc', usersDoc.size);
  if (usersDoc.size !== users.length) {
    throw new HttpsError('not-found', 'Alguns usuários não foram encontrados');
  }

  await scheduleRef.update({
    startDate,
    endDate,
    type,
    users: usersDoc.docs.map((doc) => doc.ref),
    updatedBy: userRef,
    updatedAt: new Date(),
  });

  return { id };
});
