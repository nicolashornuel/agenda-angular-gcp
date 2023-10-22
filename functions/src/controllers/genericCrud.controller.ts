
import { onCall } from 'firebase-functions/v2/https';
import { opts } from '../services/config.service';
import { createOne, deleteOne, findByField, findByDateRange, getAll, updateOne } from '../services/genericCrud.service';
import { tryCatch } from '../services/tryCatch.service';

export const onCallGetAll = onCall(opts, req => tryCatch(req, () => getAll(req)));
export const onCallCreateOne = onCall(opts, req => tryCatch(req, () => createOne(req)));
export const onCallUpdateOne = onCall(opts, req => tryCatch(req, () => updateOne(req)));
export const onCallDeleteOne = onCall(opts, req => tryCatch(req, () => deleteOne(req)));
export const onCallFindByField = onCall(opts, req => tryCatch(req, () => findByField(req)));
export const onCallFindByDateRange = onCall(opts, req => tryCatch(req, () => findByDateRange(req)));
