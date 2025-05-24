
import { onCall } from 'firebase-functions/v2/https';
import { opts } from '../services/config.service';
import { createOne, deleteOne, findByField, findByDateRange, getAll, updateOne } from '../services/genericCrud.service';
import { tryCatch, tryCatchProtect } from '../services/tryCatch.service';

export const onCallCreateOne = onCall(opts, req => tryCatchProtect(req, () => createOne(req)));
export const onCallUpdateOne = onCall(opts, req => tryCatchProtect(req, () => updateOne(req)));
export const onCallDeleteOne = onCall(opts, req => tryCatchProtect(req, () => deleteOne(req)));

export const onCallGetAll = onCall(opts, req => tryCatch(() => getAll(req)));
export const onCallFindByField = onCall(opts, req => tryCatch(() => findByField(req)));
export const onCallFindByDateRange = onCall(opts, req => tryCatch(() => findByDateRange(req)));
