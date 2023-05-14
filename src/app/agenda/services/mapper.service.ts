import { Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { CalEventDTO, CalEventEntity, CalEventField, CalEventType } from '../models/cal-event.models';

@Injectable({
  providedIn: 'root'
})
export class MapperService {

  constructor() { }

  public entitiesToDTOs(events: CalEventEntity[]): CalEventDTO[] {
    return events.map(event => {
      const newEvent: CalEventDTO = {
        ...event,
        start: event.meta!.start.toDate()
      }
      if (event.meta?.end) newEvent.end = event.meta!.end.toDate();
      return newEvent;
    })
  }

  public fieldToEntity(event: CalEventField, date: Date): CalEventEntity {
    return {
      title: event.title!,
      meta: {
        type: event.meta!.type!,
        start: Timestamp.fromDate(new Date(date.toDateString() + ' ' + event.meta!.start)),
        end: event.meta!.end ? Timestamp.fromDate(new Date(date.toDateString() + ' ' + event.meta!.end)) : undefined,
      }
    }
  }

  public commentToEntity(value: string, date: Date): CalEventEntity {
    return {
      title: value,
      meta: {
        type: CalEventType.COMMENT,
        start: Timestamp.fromDate(date)
      }
    }
  }
  

}
