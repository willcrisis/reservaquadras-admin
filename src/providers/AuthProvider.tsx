import { auth, db, firebaseEmailAuthConfig } from '@/config/firebase';
import { Role } from '@/db/role';
import { USERS_COLLECTION, type User as DbUser } from '@/db/user';
import { AuthContext, Permissions } from '@/hooks/useAuth';
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signOut, User } from 'firebase/auth';
import { doc, DocumentReference, getDoc } from 'firebase/firestore';
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({} as Permissions);
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
    getDoc(doc(db, USERS_COLLECTION, user?.uid || '') as DocumentReference<DbUser>)
      .then((snapshot) => {
        if (!snapshot) return;
        getDoc(snapshot.data()!.role)
          .then((roleSnapshot) => {
            setUser(user);
            setRole({ id: roleSnapshot.id, ...roleSnapshot.data() } as Role);
            setPermissions({
              manage_users: roleSnapshot.id === 'sudo',
              manage_schedules: roleSnapshot.id === 'admin' || roleSnapshot.id === 'sudo',
            } as Permissions);
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
    () => ({ user, role, permissions, loading, authing, authenticate, logout }),
    [user, role, permissions, loading, authing, authenticate, logout],
  );

  return <AuthContext.Provider value={providerValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
