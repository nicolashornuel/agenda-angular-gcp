import {Injectable} from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  Timestamp,
  collection,
  collectionData,
  deleteDoc,
  doc,
  setDoc
} from '@angular/fire/firestore';
import {toDoDTO, toDoEntity} from '../models/to-do.model';
import {Observable, map, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private collectionRef!: CollectionReference<toDoEntity>;

  constructor(private firestore: Firestore) {
    this.collectionRef = collection(this.firestore, 'todoList') as CollectionReference<toDoEntity>;
  }

  public getAll(): Observable<toDoDTO[]> {
    return collectionData<toDoEntity>(this.collectionRef, {idField: 'id'}).pipe(
      map(toDoEntities => this.entitiesToDTOs(toDoEntities))
    );
  }

  public async save(toDoDTO: toDoDTO): Promise<string> {
    const toDoEntity: toDoEntity = this.dtoToEntity(toDoDTO);
    const docRef: DocumentReference<DocumentData> = doc(this.collectionRef);
    toDoEntity.id = docRef.id;
    await setDoc(docRef, {...toDoEntity});
    return docRef.id;
  }

  public async update(toDoDTO: toDoDTO): Promise<void> {
    const toDoEntity: toDoEntity = this.dtoToEntity(toDoDTO);
    const docRef: DocumentReference<DocumentData> = doc(this.collectionRef, toDoDTO.id);
    await setDoc(docRef, {...toDoEntity});
  }

  public delete(id: string): Promise<void> {
    const docRef: DocumentReference<DocumentData> = doc(this.collectionRef, id);
    return deleteDoc(docRef);
  }

  private entitiesToDTOs(toDoEntities: toDoEntity[]): toDoDTO[] {
    return toDoEntities.map((toDoEntity: toDoEntity) => ({
      ...toDoEntity,
      creatingDate: toDoEntity.creatingDate.toDate(),
      updatingDate: toDoEntity.updatingDate ? toDoEntity.updatingDate.toDate() : undefined
    }));
  }

  private dtoToEntity(toDoDTO: toDoDTO): toDoEntity {
    const toDoEntity: toDoEntity = {
      isResolved: toDoDTO.isResolved,
      description: toDoDTO.description,
      priority: toDoDTO.priority,
      category: toDoDTO.category,
      creatingDate: toDoDTO.id ? Timestamp.fromDate(new Date(toDoDTO.creatingDate)) : Timestamp.fromDate(new Date())
    };
    if (toDoDTO.id) {
      toDoEntity.id = toDoDTO.id;
      toDoEntity.updatingDate = Timestamp.fromDate(new Date());
    }
    return toDoEntity;
  }
}
