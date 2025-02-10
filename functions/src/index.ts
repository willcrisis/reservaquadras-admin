/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { createUser as createUserFunction } from './users';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

initializeApp();
getFirestore().settings({
  ignoreUndefinedProperties: true,
});

export const addMessage = onRequest(async (request, response) => {
  const { text } = request.query;
  const snapshot = await getFirestore().collection('messages').add({ text });
  response.json({ result: `Message with ID: ${snapshot.id} added` });
});

export const makeUppercase = onDocumentCreated('/messages/{documentId}', async (event) => {
  const text = event.data?.data().text;
  logger.log('Uppercasing this shit', event.params.documentId, text);
  const uppercase = text.toUpperCase();
  return event.data?.ref.set({ uppercase: uppercase }, { merge: true });
});

export const createUser = createUserFunction;
