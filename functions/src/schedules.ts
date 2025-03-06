import { HttpsError, onCall } from "firebase-functions/https";
import { checkPermissions } from "./utils/auth";
import { getFirestore } from "firebase-admin/firestore";
import { buildRange } from "./utils/schedule";

export const createSchedule = onCall(async (request) => {
  const userRef = await checkPermissions(request, ['sudo', 'admin']);

  const { startDate, endDate, courts, type } = request.data;
  
  const collection = getFirestore().collection(type);

  const schedules = await Promise.all(courts.map(async (court: string) => {
    const courtRef = getFirestore().collection('courts').doc(court);
    
    const courtDoc = await courtRef.get();
    if (!courtDoc.exists) {
      throw new Error('Court not found');
    }

    const query = collection.where('startDate', '>=', startDate).where('endDate', '<=', endDate).where('court', '==', courtRef);
    const schedules = await query.get();

    if (schedules.size > 0) {
      throw new HttpsError('already-exists', 'Já existe um agendamento nessa quadra nesse horário');
    }
    
    await getFirestore().collection(type).add({
      startDate,
      endDate,
      court: courtRef,
      createdBy: userRef,
      createdAt: new Date(),
    });
  }));

  return { success: schedules.length };
});

export const createAllDaySchedule = onCall(async (request) => {
  const userRef = await checkPermissions(request, ['sudo', 'admin']);

  const { startDate, endDate, courts, type, interval } = request.data;

  const collection = getFirestore().collection(type);

  const range = buildRange(startDate, endDate, interval);

  const schedules = await Promise.all(courts.map(async (court: string) => {
    const courtRef = getFirestore().collection('courts').doc(court);
    
    const courtDoc = await courtRef.get();
    if (!courtDoc.exists) {
      throw new Error('Court not found');
    }

    const query = collection.where('startDate', '>=', startDate).where('endDate', '<=', endDate).where('court', '==', courtRef);
    const schedules = await query.get();

    if (schedules.size > 0) {
      throw new HttpsError('already-exists', 'Já existe um agendamento nessa quadra nesse horário');
    }

    await Promise.all(range.map(async (range) => {
      await collection.add({
        startDate: range.start.getTime(),
        endDate: range.end.getTime(),
        court: courtRef,
        createdBy: userRef,
        createdAt: new Date(),
      });
    }));
  }));

  return { success: schedules.length };
});
