import { DocumentReference } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/https";

export const documentExists = async (docRef: DocumentReference) => {
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new HttpsError('not-found', 'Documento não encontrado');
  }

  return doc.data()!;
}