import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { AbstractCrudService } from 'app/core/services/abstractCrud.service';
import { CalEventDTO, CalEventEntity, CalEventField, CalEventType } from '@agenda/models/calEvent.model';
import { Timestamp } from '@firebase/firestore';
import { endOfMonth, startOfMonth } from 'date-fns';


@Injectable({
  providedIn: 'root'
})
export class EventService extends AbstractCrudService {

  events: CalendarEvent[] = [];

  constructor() {
    super('calendarEvent');
  }

  public eventTimesChanged({ event, newStart, allDay }: CalendarEventTimesChangedEvent): CalendarEvent[] {
    if (typeof allDay !== 'undefined') event.allDay = allDay;
    event.start = newStart;
    this.events.push(event);
    this.events = [...this.events];
    return this.events;
  }

  public async getCurrentList(date: Date): Promise<any> {
    const { startAt, endAt } = this.getTimestampRangeOfMonth(date);
    const { data } = await this.findByDateRange('meta.start', startAt, endAt);
    return this.entitiesToDTOs(data as CalEventEntity[]);
  }

  private entitiesToDTOs(events: CalEventEntity[]): CalEventDTO[] {
    return events.map(event => {
      const newEvent: CalEventDTO = {
        id: event.id,
        title: event.title,
        start: this.toDate(event.meta!.start),
        meta: {
          type: event.meta?.type
        }
      }
      if (event.meta?.end) newEvent.end = this.toDate(event.meta!.end);
      return newEvent;
    })
  }

  private fieldToEntity(event: CalEventField, date: Date): CalEventEntity {
    return {
      title: event.title!,
      meta: {
        type: event.meta!.type!,
        start: Timestamp.fromDate(new Date(date.toDateString() + ' ' + event.meta!.start)),
        end: event.meta!.end ? Timestamp.fromDate(new Date(date.toDateString() + ' ' + event.meta!.end)) : undefined,
      }
    }
  }

  private commentToEntity(value: string, date: Date): CalEventEntity {
    return {
      title: value,
      meta: {
        type: CalEventType.COMMENT,
        start: Timestamp.fromDate(date)
      }
    }
  }


  private getTimestampRangeOfMonth(date: Date): { startAt: number; endAt: number; } {
    const startAt = startOfMonth(date).getTime();
    const endAt = endOfMonth(date).getTime();
    return { startAt, endAt }
  }

}

