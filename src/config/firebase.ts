import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEmailAuthConfig = {
  url: import.meta.env.VITE_FIREBASE_AUTH_URL,
  handleCodeInApp: true,
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 9090);

export const auth = getAuth(app);
connectAuthEmulator(auth, 'http://localhost:9099');

export const functions = getFunctions(app);
connectFunctionsEmulator(functions, 'localhost', 5001);
