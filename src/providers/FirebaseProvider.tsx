import { initializeApp } from 'firebase/app';
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
  type User,
} from 'firebase/auth';
import firebaseConfig, { firebaseEmailAuthConfig } from '@/config/firebase';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

type FirebaseContextValue = {
  user: User | null;
  role: string;
  loading: boolean;
  authing: boolean;
  authenticate: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};
const FirebaseContext = createContext<FirebaseContextValue>(undefined as unknown as FirebaseContextValue);

const FirebaseProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [authing, setAuthing] = useState(true);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            window.location.href = '/';
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setAuthing(false);
          });
      } else {
        console.error('Email not found in local storage');
        setAuthing(false);
      }
    } else {
      setAuthing(false);
    }
  }, []);

  auth.onAuthStateChanged((user) => {
    getDoc(doc(db, 'users', user?.uid))
      .then((snapshot) => {
        getDoc(snapshot?.data().role)
          .then((roleSnapshot) => {
            setUser(user);
            setRole(roleSnapshot?.id);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        setLoading(false);
      });
  });

  const authenticate = useCallback((email: string) => sendSignInLinkToEmail(auth, email, firebaseEmailAuthConfig), []);

  const logout = useCallback(() => signOut(auth), []);

  const providerValue = useMemo(
    () => ({ user, role, loading, authing, authenticate, logout }),
    [user, role, loading, authing, authenticate, logout],
  );

  return <FirebaseContext.Provider value={providerValue}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => useContext(FirebaseContext);

export default FirebaseProvider;
