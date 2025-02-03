import { db } from '@/config/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useDocumentRealtimeData = <T>(root: string, ...paths: string[]) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const docRef = doc(collection(db, root), ...paths);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setData((snapshot.data() as T) || null);
        setLoading(false);
      },
      (error) => {
        setError(error);
      },
    );

    return () => unsubscribe();
  }, [root, paths]);

  return { data, loading, error };
};

export const useCollectionRealtimeData = <T>(root: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const collectionRef = collection(db, root);
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        setData(snapshot.docs.map((doc) => doc.data() as T));
        setLoading(false);
      },
      (error) => {
        setError(error);
      },
    );

    return () => unsubscribe();
  }, [root]);

  return { data, loading, error };
};
