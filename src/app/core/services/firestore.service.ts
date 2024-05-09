import { inject } from '@angular/core';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  setDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export abstract class FirestoreService<T> {

  private firestore = inject(Firestore);
  protected collectionRef!: CollectionReference<T>;

  constructor(path: string) {
    this.collectionRef = collection(this.firestore, path) as CollectionReference<T>;
  }

  public getAll(): Observable<T[]> {
    return collectionData(this.collectionRef, { idField: 'id' });
  }

  public async save(document: T): Promise<string> {
    const docRef: DocumentReference<T> = doc(this.collectionRef)
    await setDoc(docRef, { ...document });
    return docRef.id;
  }

  public async update(document: T, id: string): Promise<void> {
    const docRef: DocumentReference<T> = doc(this.collectionRef, id)
    await setDoc(docRef, { ...document });
  }

  public delete(id: string): Promise<void> {
    const docRef: DocumentReference<T> = doc(this.collectionRef, id);
    return deleteDoc(docRef);
  }
}
