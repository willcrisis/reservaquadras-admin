import { onRequest } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export const createUser = onRequest(async (request, response) => {
  const { name, phoneNumber, email, roles } = request.body.data;
  const user = await getAuth().createUser({
    displayName: name,
    ...(phoneNumber ? { phoneNumber } : {}),
    ...(email ? { email } : {}),
  });
  await getFirestore().collection('users').doc(user.uid).set({
    name,
    email,
    phoneNumber,
    roles,
  })
  response.json({ data: {id: user.uid} });
});