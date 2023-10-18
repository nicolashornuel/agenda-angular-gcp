import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import { CallableRequest, onCall } from 'firebase-functions/v2/https';
import { opts } from '../services/config.service';
import { httpsErrorsPermissionDenied, httpsSuccessfull } from '../services/error.service';
import { getFirestoreCollection } from '../services/genericCrud.service';
import { tryCatch } from '../services/tryCatch.service';

const collection: string = 'user';

export const onCallGetOneUser = onCall(opts, req => tryCatch(req, () => findByUid(req, collection)));

async function findByUid(request: CallableRequest<string>, name: string): Promise<any> {
  const user: QuerySnapshot<DocumentData> = await getFirestoreCollection(name).where('uid', '==', request.data).get();
  if (!user.empty) {
    const docs: QueryDocumentSnapshot<DocumentData>[] = user.docs;
    const users = docs.map( (doc: DocumentSnapshot) => ({ ...doc.data(), id: doc.id }));
    return httpsSuccessfull('Ok', 'retrieve user', users[0]);
  } else {
    httpsErrorsPermissionDenied();
  }
}


/*  


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
  } */
