import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, DocumentReference, Firestore, collection, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private collectionRef!: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.collectionRef = collection(this.firestore, 'todoList');
  }

  public async save(document: any): Promise<string> {
    const docRef: DocumentReference<DocumentData> = doc(this.collectionRef)
    await setDoc(docRef, { ...document });
    return docRef.id;
  }
}
