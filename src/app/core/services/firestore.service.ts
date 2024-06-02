import { inject } from '@angular/core';
import {
  CollectionReference,
  DocumentReference,
  FieldPath,
  Firestore,
  Query,
  QueryDocumentSnapshot,
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
import { Observable } from 'rxjs';

export type Pageable<T> = {
  items: T[];
  hasNext: boolean;
  hasPrevious: boolean;
};

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

  public async firstPageOLD(fieldPath: string, pageSize: number): Promise<T[]> {
    this.hasPrevious = false;
    const q = query(this.collectionRef, orderBy(fieldPath), limit(pageSize + 1));
    const items = await this.getDocs(q);
    this.hasNext = items.length > pageSize ?? false;
    return items.slice(0, pageSize);
  }

  public async nextPageOLD(fieldPath: string | FieldPath, pageSize: number): Promise<T[]> {
    this.hasPrevious = true;
    const q = query(this.collectionRef, orderBy(fieldPath), startAt(this.lastVisible), limit(pageSize + 1));
    const items = await this.getDocs(q);
    this.hasNext = items.length > pageSize ?? false;
    return items.slice(0, pageSize);
  }

  public async prevPageOLD(fieldPath: string | FieldPath, pageSize: number): Promise<T[]> {
    this.hasNext = true;
    const q = query(this.collectionRef, orderBy(fieldPath), endAt(this.firstVisible), limitToLast(pageSize + 1));
    const items = await this.getDocs(q);
    this.hasPrevious = items.length > pageSize ?? false;
    return items.slice(0, pageSize);
  }

  public async lastPageOLD(fieldPath: string, pageSize: number): Promise<T[]> {
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

  public async firstPage(fieldPath: string, pageSize: number): Promise<Pageable<T>> {
    const skip = 0;
    const take = pageSize + 1;
    const q = query(this.collectionRef, orderBy(fieldPath), limit(take));
    const documentSnapshots = await getDocs(q);
    const items = documentSnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const itemsCount = items.length;
    const itemsVisible = items.slice(skip, pageSize);
    const itemsVisibleCount = itemsVisible.length;
    this.firstVisible = documentSnapshots.docs[skip];
    this.lastVisible = documentSnapshots.docs[itemsVisibleCount - 1];
    return {
      items: [...itemsVisible],
      hasPrevious: false,
      hasNext: itemsCount > pageSize ?? false
    };
  }

  public async prevPage(fieldPath: string | FieldPath, pageSize: number): Promise<Pageable<T>> {
    const take = pageSize + 1;
    const q = query(this.collectionRef, orderBy(fieldPath), endBefore(this.firstVisible), limitToLast(take));
    const documentSnapshots = await getDocs(q);
    const items = documentSnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const skip = items.length == pageSize ? 0 : 1;
    const itemsVisible = items.slice(skip, take);
    this.firstVisible = documentSnapshots.docs[skip];
    this.lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    return {
      items: [...itemsVisible],
      hasPrevious: items.length > pageSize ?? false,
      hasNext: true
    };
  }


  public async nextPage(fieldPath: string | FieldPath, pageSize: number): Promise<Pageable<T>> {
    const skip = 0;
    const take = pageSize + 1;
    const q = query(this.collectionRef, orderBy(fieldPath), startAfter(this.lastVisible), limit(take));
    const documentSnapshots = await getDocs(q);
    const items = documentSnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const itemsCount = items.length;
    const itemsVisible = items.slice(skip, pageSize);
    const itemsVisibleCount = itemsVisible.length;
    this.firstVisible = documentSnapshots.docs[skip];
    this.lastVisible = documentSnapshots.docs[itemsVisibleCount - 1];
    return {
      items: [...itemsVisible],
      hasPrevious: true,
      hasNext: itemsCount > pageSize ?? false
    };
  }

  public async lastPage(fieldPath: string | FieldPath, pageSize: number): Promise<Pageable<T>> {
    const skip = 0;
    const take = pageSize + 1;
    const countTotal = await this.getCountFromServer();
    const countLast = countTotal % pageSize;
    const q = query(this.collectionRef, orderBy(fieldPath), limitToLast(countLast + 1));
    const documentSnapshots = await getDocs(q);
    const items = documentSnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const itemsCount = items.length;
    const itemsVisible = items.slice(skip, countLast);
    const itemsVisibleCount = itemsVisible.length;
    this.firstVisible = documentSnapshots.docs[skip];
    this.lastVisible = documentSnapshots.docs[itemsVisibleCount - 1];
    return {
      items: [...itemsVisible],
      hasPrevious: countTotal > countLast ?? false,
      hasNext: false
    };
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
