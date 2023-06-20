import { Injectable } from '@angular/core';
import { UserCredential, UserInfo } from '@angular/fire/auth';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
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
    const docRef: DocumentReference<UserInfo> = doc(this.collectionRef);
    const q = query(this.collectionRef, where("uid", "==", uid))
    getDocs<UserInfo>(q);
    const res = await getDoc<UserInfo>(docRef);
    return res.data();
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
