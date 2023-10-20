import { initializeApp } from 'firebase-admin/app';

initializeApp();

//import { DocumentData, DocumentSnapshot, QuerySnapshot, getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { onCallCreateOneEvent, onCallDeleteOneEvent, onCallGetAllEvent, onCallUpdateOneEvent } from './controllers/event.controller';
import { onCallGetOneUser } from './controllers/user.controller';

exports.onCallGetOneUser = onCallGetOneUser;
exports.onCallGetAllEvent = onCallGetAllEvent;
exports.onCallCreateOneEvent = onCallCreateOneEvent;
exports.onCallUpdateOneEvent = onCallUpdateOneEvent;
exports.onCallDeleteOneEvent = onCallDeleteOneEvent;

exports.onRequest = onRequest( async (req, res) => {
    //https://glowing-sniffle-p6j57p657qqcrg99-5001.app.github.dev/agenda-bf245/us-central1/onRequest

    switch (req.method) {
        case 'GET':
            //const data = await getEvents();
            //const dtos = toDTOs(data as CalEventEntity[]);
            res.send({ok:"ok"});
            //res.status(200).json(dtos);
            break;
        default:
            break;
    }
})

/* async function getEvents() {
    const query: QuerySnapshot<DocumentData> = await getFirestore().collection('calendarEvent').get();
    return query.docs.map( (doc: DocumentSnapshot) => ({ ...doc.data(), id: doc.id }));
} */