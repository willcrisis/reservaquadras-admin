import { onCall } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { onDocumentDeleted } from 'firebase-functions/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { log } from 'firebase-functions/logger';
import { checkPermissions } from './utils/auth';

export const createUser = onCall(async (request) => {
  await checkPermissions(request, ['sudo']);

  const { name, phoneNumber, email, roles, countryCode } = request.data;
  const newUser = await getAuth().createUser({
    displayName: name,
    ...(phoneNumber && countryCode ? { phoneNumber: `+${countryCode}${phoneNumber}` } : {}),
    ...(email ? { email } : {}),
  });

  await getFirestore().collection('users').doc(newUser.uid).set({
    name,
    email,
    phoneNumber,
    roles,
    countryCode,
  });
  return { id: newUser.uid };
});

export const updateUser = onCall(async (request) => {
  await checkPermissions(request, ['sudo']);

  const { id, ...data } = request.data;
  const { name, phoneNumber, email, countryCode } = data;

  await getAuth().updateUser(id, {
    displayName: name,
    ...(phoneNumber && countryCode ? { phoneNumber: `+${countryCode}${phoneNumber}` } : {}),
    ...(email ? { email } : {}),
  });

  await getFirestore().collection('users').doc(id).update(data);

  return { id };
});

export const cleanupDeletedUser = onDocumentDeleted('/users/{userId}', async (event) => {
  log('Deleting user', event.params.userId);
  try {
    await getAuth().deleteUser(event.params.userId);
  } catch (error) {
    log('Error deleting user', event.params.userId, error);
  }
});
