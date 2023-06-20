import {Injectable} from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private collectionRef!: CollectionReference<User>;

  constructor(private firestore: Firestore) {
    this.collectionRef = collection(this.firestore, 'user') as CollectionReference<User>;
  }

  public async getOne(userId: string): Promise<User | undefined> {
    const docRef: DocumentReference<User> = doc(this.collectionRef, userId);
    const res = await getDoc<User>(docRef);
    return res.data();
  }

  public async saveOne(user: User): Promise<string> {
    const docRef: DocumentReference<User> = doc(this.collectionRef);
    await setDoc(docRef, {...user});
    return docRef.id;
  }
}
