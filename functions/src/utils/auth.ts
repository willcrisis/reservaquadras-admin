import { getFirestore } from "firebase-admin/firestore";
import { CallableRequest, HttpsError } from "firebase-functions/v2/https";
import { log } from 'firebase-functions/logger';

export const checkPermissions = async (request: CallableRequest, permissions: string[]) => {
  if (!request.auth?.uid) {
    log('No user id');
    throw new HttpsError('unauthenticated', 'Não autorizado');
  }

  const user = await getFirestore().collection('users').doc(request.auth.uid).get();
  if (!user.exists) {
    log('User not found in firestore', request.auth.uid);
    throw new HttpsError('unauthenticated', 'Não autorizado');
  }

  if (!user.data()?.roles.some((role: string) => permissions.includes(role))) {
    log('User does not have permission', request.auth.uid, permissions);
    throw new HttpsError('permission-denied', 'Não autorizado');
  }
};