import { CalEventDTO, CalEventEntity, CalEventField } from '@models/calEvent.model';
import { Timestamp } from 'firebase-admin/firestore';

function toDTO(event: CalEventEntity): CalEventDTO {
        const newEvent: CalEventDTO = {
            ...event,
            start: (event.meta!.start as Timestamp).toDate()
        }
        if (event.meta?.end) newEvent.end = (event.meta!.end as Timestamp).toDate();
        return newEvent;
}

function toEntity(event: CalEventField, date: Date): CalEventEntity {
    return {
        title: event.title!,
        meta: {
            type: event.meta!.type!,
            start: new Date(date.toDateString() + ' ' + event.meta!.start).getTime(),
            end: event.meta!.end ? new Date(date.toDateString() + ' ' + event.meta!.end).getTime() : undefined,
        }
    }
}

function toDTOs(events: CalEventEntity[]): CalEventDTO[] {
    return events.map(event => toDTO(event))
}

export { toDTO, toDTOs, toEntity };
