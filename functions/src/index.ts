import { initializeApp } from 'firebase-admin/app';

initializeApp();

import { onCallGetOneUser } from './controllers/user.controller';
import { onCallCreateOneEvent, onCallDeleteOneEvent, onCallGetAllEvent, onCallUpdateOneEvent } from './controllers/event.controller';

exports.onCallGetOneUser = onCallGetOneUser;
exports.onCallGetAllEvent = onCallGetAllEvent;
exports.onCallCreateOneEvent = onCallCreateOneEvent;
exports.onCallUpdateOneEvent = onCallUpdateOneEvent;
exports.onCallDeleteOneEvent = onCallDeleteOneEvent;