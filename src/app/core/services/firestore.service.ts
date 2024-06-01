import { inject } from '@angular/core';
import {
  CollectionReference,
  DocumentReference,
  FieldPath,
  Firestore,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
  collectionData,
  deleteDoc,
  doc,
  endAt,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  setDoc,
  startAfter,
  startAt
} from '@angular/fire/firestore';
import { Observable, firstValueFrom } from 'rxjs';

export abstract class FirestoreService<T> {
  private firestore = inject(Firestore);
  protected collectionRef!: CollectionReference<T>;
  private lastVisible!: QueryDocumentSnapshot<T>;
  private firstVisible!: QueryDocumentSnapshot<T>;
  public hasNext!: boolean;
  public hasPrevious!: boolean;

  constructor(path: string) {
    this.collectionRef = collection(this.firestore, path) as CollectionReference<T>;
  }

  public getAll(): Observable<T[]> {
    return collectionData(this.collectionRef, { idField: 'id' });
  }

  public async getCountFromServer(): Promise<number> {
    const snapshot = await getCountFromServer(this.collectionRef);
    return snapshot.data().count;
  }

  public async firstPage(fieldPath: string, pageSize: number): Promise<T[]> {
    this.hasPrevious = false;
    const q = query(this.collectionRef, orderBy(fieldPath), limit(pageSize + 1));
    const items = await this.getDocs(q);
    this.hasNext = items.length > pageSize ?? false;
    return items.slice(0, pageSize);
  }

  public async nextPage(fieldPath: string | FieldPath, pageSize: number): Promise<T[]> {
    this.hasPrevious = true;
    const q = query(this.collectionRef, orderBy(fieldPath), startAt(this.lastVisible), limit(pageSize + 1));
    const items = await this.getDocs(q);
    this.hasNext = items.length > pageSize ?? false;
    return items.slice(0, pageSize);
  }

  public async prevPage(fieldPath: string | FieldPath, pageSize: number): Promise<T[]> {
    this.hasNext = true;
    const q = query(this.collectionRef, orderBy(fieldPath), endAt(this.firstVisible), limitToLast(pageSize + 1));
    const items = await this.getDocs(q);
    this.hasPrevious = items.length > pageSize ?? false;
    return items.slice(0, pageSize);
  }

  public async lastPage(fieldPath: string, pageSize: number): Promise<T[]> {
    this.hasNext = false;
    const countTotal = await this.getCountFromServer();
    const countLast = countTotal % pageSize;
    const q = query(this.collectionRef, orderBy(fieldPath), limitToLast(countLast + 1));
    const items = await this.getDocs(q);
    this.hasPrevious = countTotal > countLast ?? false;
    return items.slice(0, countLast);
  }

  private async getDocs(query: Query<T>): Promise<T[]> {
    const documentSnapshots = await getDocs(query);
    this.firstVisible = documentSnapshots.docs[0];
    this.lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    return documentSnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }

  public async save(document: T): Promise<string> {
    const docRef: DocumentReference<T> = doc(this.collectionRef);
    await setDoc(docRef, { ...document });
    return docRef.id;
  }

  public async update(document: T, id: string): Promise<void> {
    const docRef: DocumentReference<T> = doc(this.collectionRef, id);
    await setDoc(docRef, { ...document });
  }

  public delete(id: string): Promise<void> {
    const docRef: DocumentReference<T> = doc(this.collectionRef, id);
    return deleteDoc(docRef);
  }
}
