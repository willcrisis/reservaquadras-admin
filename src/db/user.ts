import { db } from '@/providers/FirebaseProvider';
import { collection, CollectionReference, doc, getDoc, getDocs } from 'firebase/firestore';

export interface User {
  name: string;
}

const connection = collection(db, 'users') as CollectionReference<User>;

export default class UsersCollection {
  static async list() {
    const snapshot = await getDocs(connection);
    return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  }

  static async get(uid: string) {
    const snapshot = await getDoc(doc(connection, uid));
    return { uid: snapshot.id, ...snapshot.data() };
  }
}
