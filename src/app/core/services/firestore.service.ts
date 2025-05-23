import { inject } from '@angular/core';
import {
  CollectionReference,
  DocumentReference,
  FieldPath,
  Firestore,
  OrderByDirection,
  QueryDocumentSnapshot,
  collection,
  collectionData,
  deleteDoc,
  doc,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  setDoc,
  startAfter,
  where
} from '@angular/fire/firestore';
import { Identifiable } from 'app/train/models/reservation.model';
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

  constructor(path?: string) {
   if (path) this.collectionRef = collection(this.firestore, path) as CollectionReference<T>;
  }
  
  public setCollection(path: string): void {    
    this.collectionRef = collection(this.firestore, path) as CollectionReference<T>;
  }

  public getAll(): Observable<T[]> {
    return collectionData(this.collectionRef, { idField: 'id' });
  }

  public getByQuery(order: { fieldPath: string | FieldPath; directionStr?: OrderByDirection }, fieldToWhere?: { key: string; value: any }): Observable<T[]> {
    const q = fieldToWhere
      ? query(this.collectionRef, orderBy(order.fieldPath, order.directionStr), where(fieldToWhere.key, '==', fieldToWhere.value))
      : query(this.collectionRef, orderBy(order.fieldPath, order.directionStr));
    return collectionData(q, { idField: 'id' });
  }

  public async getCountFromServer(): Promise<number> {
    const snapshot = await getCountFromServer(this.collectionRef);
    return snapshot.data().count;
  }

  public async firstPage(order: { fieldPath: string | FieldPath; directionStr?: OrderByDirection }, pageSize: number): Promise<Pageable<T>> {
    const skip = 0;
    const take = pageSize + 1;
    const q = query(this.collectionRef, orderBy(order.fieldPath, order.directionStr), limit(take));
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
      hasNext: itemsCount > pageSize
    };
  }

  public async prevPage(order: { fieldPath: string | FieldPath; directionStr?: OrderByDirection }, pageSize: number): Promise<Pageable<T>> {
    const take = pageSize + 1;
    const q = query(this.collectionRef, orderBy(order.fieldPath, order.directionStr), endBefore(this.firstVisible), limitToLast(take));
    const documentSnapshots = await getDocs(q);
    const items = documentSnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const skip = items.length == pageSize ? 0 : 1;
    const itemsVisible = items.slice(skip, take);
    this.firstVisible = documentSnapshots.docs[skip];
    this.lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    return {
      items: [...itemsVisible],
      hasPrevious: items.length > pageSize,
      hasNext: true
    };
  }

  public async nextPage(order: { fieldPath: string | FieldPath; directionStr?: OrderByDirection }, pageSize: number): Promise<Pageable<T>> {
    const skip = 0;
    const take = pageSize + 1;
    const q = query(this.collectionRef, orderBy(order.fieldPath, order.directionStr), startAfter(this.lastVisible), limit(take));
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
      hasNext: itemsCount > pageSize
    };
  }

  public async lastPage(order: { fieldPath: string | FieldPath; directionStr?: OrderByDirection }, pageSize: number): Promise<Pageable<T>> {
    const skip = 1;
    const countTotal = await this.getCountFromServer();
    const take = countTotal % pageSize === 0 ? pageSize : countTotal % pageSize;
    const q = query(this.collectionRef, orderBy(order.fieldPath, order.directionStr), limitToLast(take + 1));
    const documentSnapshots = await getDocs(q);
    const items = documentSnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const itemsVisible = items.slice(skip, take + skip);
    this.firstVisible = documentSnapshots.docs[skip];
    this.lastVisible = documentSnapshots.docs[take + skip - 1];
    return {
      items: [...itemsVisible],
      hasPrevious: countTotal > take,
      hasNext: false
    };
  }

  public async save(document: T): Promise<void> {
    const docRef: DocumentReference<T> = doc(this.collectionRef);
    await setDoc(docRef, { ...document });
    (document as Identifiable).id = docRef.id;
  }

  public async update(document: T, id: string): Promise<void> {
    const docRef: DocumentReference<T> = doc(this.collectionRef, id);
    await setDoc(docRef, { ...document });
  }

  public async delete(id: string): Promise<void> {
    const docRef: DocumentReference<T> = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }

  public async saveOrUpdate(document: Identifiable): Promise<any> {
    document.id ? await this.update(document as T, document.id) : await this.save(document as T);
  }
}
