import { auth, db, firebaseEmailAuthConfig } from '@/config/firebase';
import { USERS_COLLECTION, type User as DbUser } from '@/db/user';
import { AuthContext, Permissions } from '@/hooks/useAuth';
import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
  User,
} from 'firebase/auth';
import { doc, DocumentReference, getDoc } from 'firebase/firestore';
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Permissions>({} as Permissions);
  const [loading, setLoading] = useState(true);
  const [authing, setAuthing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            navigate('/');
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

  const authenticate = useCallback((email: string) => sendSignInLinkToEmail(auth, email, firebaseEmailAuthConfig), []);

  const logout = useCallback(() => signOut(auth), []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUser(null);
        setRoles([]);
        setPermissions({} as Permissions);
        logout();
        setLoading(false);
        setAuthing(false);
        return;
      }
      getDoc(doc(db, USERS_COLLECTION, user?.uid || '') as DocumentReference<DbUser>)
        .then((snapshot) => {
          if (!snapshot) return;
          setUser(user);
          const userRoles = snapshot.data()!.roles;
          setRoles(userRoles);
          setPermissions({
            manage_users: userRoles.includes('sudo'),
            manage_courts: userRoles.includes('sudo'),
            manage_schedules: ['admin', 'sudo'].some((role) => userRoles.includes(role)),
          } as Permissions);
          setLoading(false);
        })
        .catch(() => {
          console.error('Error fetching user');
          setLoading(false);
        });
    });
  }, []);

  const providerValue = useMemo(
    () => ({ user, roles, permissions, loading, authing, authenticate, logout }),
    [user, roles, permissions, loading, authing, authenticate, logout],
  );

  return <AuthContext.Provider value={providerValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
