import { Injectable } from '@angular/core';
import { UserCredential, UserInfo } from '@angular/fire/auth';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';

export interface User {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private collectionRef!: CollectionReference<UserInfo>;

  constructor(private firestore: Firestore) {
    this.collectionRef = collection(this.firestore, 'user') as CollectionReference<UserInfo>;
  }

  public async getOne(uid: string): Promise<UserInfo | undefined> {
    const q = query(this.collectionRef, where("uid", "==", uid));
    const res: QuerySnapshot<UserInfo> = await getDocs<UserInfo>(q);
    let userInfo: UserInfo | undefined = undefined;
    res.forEach( (doc: QueryDocumentSnapshot<UserInfo>) => userInfo = doc.data());
    return userInfo;
  }

  public async saveOne(userCredential: UserCredential): Promise<UserInfo> {
    const userInfo: UserInfo = this.mapper(userCredential);
    const docRef: DocumentReference<UserInfo> = doc(this.collectionRef);
    await setDoc(docRef, {...userInfo});
    return userInfo;
  }

  private mapper(userCredential: UserCredential): UserInfo {
    const user: User = userCredential.user;
    return {
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      providerId: user.providerId,
      uid: user.uid
    }
  }
}
