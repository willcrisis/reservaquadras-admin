/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import {
  createUser as createUserFunction,
  updateUser as updateUserFunction,
  cleanupDeletedUser as cleanupDeletedUserFunction,
} from './users';
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

initializeApp();
getFirestore().settings({
  ignoreUndefinedProperties: true,
});

export const createUser = createUserFunction;
export const updateUser = updateUserFunction;
export const cleanupDeletedUser = cleanupDeletedUserFunction;
