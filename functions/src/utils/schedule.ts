import { addMinutes } from 'date-fns';
import { HttpsError } from 'firebase-functions/https';
import { DocumentReference, CollectionReference, FieldPath } from 'firebase-admin/firestore';

export const buildRange = (startDate: Date, endDate: Date, interval: number) => {
  const range = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const end = addMinutes(currentDate, interval);
    range.push({ start: currentDate, end });
    currentDate = end;
  }
  return range;
};

export const checkClash = async (
  collection: CollectionReference,
  startDate: Date,
  endDate: Date,
  courtRef: DocumentReference,
  id?: string,
) => {
  let query = collection
    .where('startDate', '>=', startDate)
    .where('endDate', '<=', endDate)
    .where('court', '==', courtRef);

    
  if (id) {
    query = query.where(FieldPath.documentId(), '!=', id);
  }

  const schedules = await query.get();

  if (schedules.size > 0) {
    throw new HttpsError('already-exists', 'Já existe um agendamento nessa quadra nesse horário');
  }
};
