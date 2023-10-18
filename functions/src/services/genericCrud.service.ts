import { CollectionReference, DocumentData, DocumentSnapshot, QuerySnapshot, WriteResult, getFirestore } from 'firebase-admin/firestore';
import { CallableRequest } from 'firebase-functions/v2/https';

function getFirestoreCollection(name: string): CollectionReference<DocumentData> {
  return getFirestore().collection(name);
}

async function getAll(_req: CallableRequest, name: string): Promise<any> {
  const query: QuerySnapshot<DocumentData> = await getFirestoreCollection(name).get();
  return query.docs.map( (doc: DocumentSnapshot) => ({ ...doc.data(), id: doc.id }));
}

async function createOne(req: CallableRequest<DocumentData>, name: string): Promise<string> {
  const docRef = await getFirestoreCollection(name).add(req.data);
  return docRef.id;
}

async function updateOne(req: CallableRequest<DocumentData>, name: string): Promise<WriteResult> {
  const document: Omit<DocumentData, "id"> = req.data.document;
  return getFirestoreCollection(name).doc(req.data.id).update(document);
}

async function deleteOne(req: CallableRequest<string>, name: string): Promise<WriteResult> {
  return getFirestoreCollection(name).doc(req.data).delete();
}

export { createOne, deleteOne, getAll, getFirestoreCollection, updateOne };

