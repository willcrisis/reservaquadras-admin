import { onRequest } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export const createUser = onRequest(async (request, response) => {
  const { name, phoneNumber, email, roles, countryCode } = request.body.data;
  const user = await getAuth().createUser({
    displayName: name,
    ...(phoneNumber && countryCode ? { phoneNumber: `+${countryCode}${phoneNumber}` } : {}),
    ...(email ? { email } : {}),
  });
  await getFirestore().collection('users').doc(user.uid).set({
    name,
    email,
    phoneNumber,
    roles,
    countryCode,
  });
  response.json({ data: { id: user.uid } });
});