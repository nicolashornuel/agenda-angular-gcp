import { initializeApp } from 'firebase-admin/app';

initializeApp();

import { onCallCreateOne, onCallDeleteOne, onCallFindByField, onCallGetAll, onCallUpdateOne, onCallFindByDateRange } from './controllers/genericCrud.controller';

exports.onCallGetAll = onCallGetAll;
exports.onCallCreateOne = onCallCreateOne;
exports.onCallUpdateOne = onCallUpdateOne;
exports.onCallDeleteOne = onCallDeleteOne;
exports.onCallFindByField = onCallFindByField;
exports.onCallFindByDateRange = onCallFindByDateRange;