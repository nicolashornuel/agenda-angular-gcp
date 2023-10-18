import { initializeApp } from 'firebase-admin/app';

initializeApp();

import { onCallGetOneUser } from './controllers/user.controller';
import { onCallCreateOneEvent, onCallDeleteOneEvent, onCallGetAllEvent, onCallUpdateOneEvent } from './controllers/event.controller';
import { onRequest } from 'firebase-functions/v2/https';

exports.onCallGetOneUser = onCallGetOneUser;
exports.onCallGetAllEvent = onCallGetAllEvent;
exports.onCallCreateOneEvent = onCallCreateOneEvent;
exports.onCallUpdateOneEvent = onCallUpdateOneEvent;
exports.onCallDeleteOneEvent = onCallDeleteOneEvent;

exports.onRequest = onRequest( (req, res) => {
    //https://glowing-sniffle-p6j57p657qqcrg99-5001.app.github.dev/agenda-bf245/us-central1/onRequest
    switch (req.method) {
        case 'GET':
            console.log("request GET");
            res.send("request GET")
            break;
        default:
            break;
    }
})