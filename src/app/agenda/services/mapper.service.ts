import { Injectable } from '@angular/core';
import { CalEventDTO, CalEventEntity, CalEventField, CalEventType } from '@models/calEvent.model';
import { Timestamp } from '@firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class MapperService {

  constructor() { }

  public entitiesToDTOs(events: CalEventEntity[]): CalEventDTO[] {    
    return events.map(event => {
      const start = event.meta!.start as Timestamp;
      console.log(start);
      console.log(start.toDate());
      
      const newEvent: CalEventDTO = {
        ...event,
        start: (event.meta!.start as Timestamp).toDate()
      }
      if (event.meta?.end) newEvent.end = new Date(event.meta!.end as number);
      
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
