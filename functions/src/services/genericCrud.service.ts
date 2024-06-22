import { CollectionReference, DocumentData, DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot, WriteResult, getFirestore } from 'firebase-admin/firestore';
import { CallableRequest } from 'firebase-functions/v2/https';

function getFirestoreCollection(name: string): CollectionReference<DocumentData> {
  return getFirestore().collection(name);
}

async function getAll(req: CallableRequest<DocumentData>): Promise<any> {
  const query: QuerySnapshot<DocumentData> = await getFirestoreCollection(req.data.collection).get();
  return query.docs.map((doc: DocumentSnapshot) => ({ ...doc.data(), id: doc.id }));
}

async function createOne(req: CallableRequest<DocumentData>): Promise<string> {
  const docRef = await getFirestoreCollection(req.data.collection).add(req.data.document);
  return docRef.id;
}

async function updateOne(req: CallableRequest<DocumentData>): Promise<WriteResult> {
  const document: Omit<DocumentData, "id"> = req.data.document;
  return getFirestoreCollection(req.data.collection).doc(req.data.id).update(document);
}

async function deleteOne(req: CallableRequest<DocumentData>): Promise<WriteResult> {
  return getFirestoreCollection(req.data.collection).doc(req.data.id).delete();
}

async function findByField(req: CallableRequest<DocumentData>): Promise<any> {
  const snapshot: QuerySnapshot<DocumentData> = await getFirestoreCollection(req.data.collection).where(req.data.key, '==', req.data.value).get();
  if (!snapshot.empty) {
    const docs: QueryDocumentSnapshot<DocumentData>[] = snapshot.docs;
    return docs.map((doc: DocumentSnapshot) => ({ ...doc.data(), id: doc.id }));
  } else {
    return []
  }
}

async function findByDateRange(req: CallableRequest<DocumentData>): Promise<any> {
  const snapshot: QuerySnapshot<DocumentData> = await getFirestoreCollection(req.data.collection)
    .where(req.data.key, '>=', new Date(req.data.startAt))
    .where(req.data.key, '<=', new Date(req.data.endAt))
    .get();
  if (!snapshot.empty) {
    const docs: QueryDocumentSnapshot<DocumentData>[] = snapshot.docs;
    return docs.map((doc: DocumentSnapshot) => ({ ...doc.data(), id: doc.id }));
  } else {
    return []
  }
}

export { createOne, deleteOne, findByField, getAll, getFirestoreCollection, updateOne, findByDateRange };

