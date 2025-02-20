import { HttpsError, onCall } from "firebase-functions/https";
import { checkPermissions } from "./utils/auth";
import { getFirestore } from "firebase-admin/firestore";

export const createSchedule = onCall(async (request) => {
  const userRef = await checkPermissions(request, ['sudo', 'admin']);

  const { startDate, endDate, courts, type } = request.data;

  const schedules = await Promise.all(courts.map(async (court: string) => {
    const courtRef = getFirestore().collection('courts').doc(court);
    
    const courtDoc = await courtRef.get();
    if (!courtDoc.exists) {
      throw new Error('Court not found');
    }

    const collection = getFirestore().collection(type);

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
