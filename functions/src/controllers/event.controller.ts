import { CalEventEntity } from '@models/calEvent.model';
import { onCall } from 'firebase-functions/v2/https';
import { toDTOs } from '../mappers/event.mapper';
import { opts } from '../services/config.service';
import { createOne, deleteOne, getAll, updateOne } from '../services/genericCrud.service';
import { tryCatch } from '../services/tryCatch.service';

const collection: string = 'calendarEvent';

export const onCallGetAllEvent = onCall(opts, req => tryCatch(req, async () => {
    const { data } = await getAll(req, collection);
    console.log(data);
    return toDTOs(data as CalEventEntity[]);
}));
export const onCallCreateOneEvent = onCall(opts, req => tryCatch(req, () => createOne(req, collection)));
export const onCallUpdateOneEvent = onCall(opts, req => tryCatch(req, () => updateOne(req, collection)));
export const onCallDeleteOneEvent = onCall(opts, req => tryCatch(req, () => deleteOne(req, collection)));
