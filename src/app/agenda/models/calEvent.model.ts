import { CalendarEvent, CalendarMonthViewDay } from "angular-calendar";
import { Timestamp } from '@angular/fire/firestore';

export enum CalEventType {
  COMMENT = 'comment',
  RECURRENT = 'recurrent',
  ANNIVERSAIRE = 'anniversaire',
  FAMILY = 'family'
}

export type CalEventEntity = Pick<CalendarEvent<{
  type: CalEventType,
  start: Timestamp,
  end?: Timestamp,
}>, 'id' | 'title' | 'meta'>

export type CalEventDTO = CalendarEvent<Partial<{
  type: CalEventType
}>>

export type CalEventField = Pick<CalendarEvent<Partial<{
  type: CalEventType,
  start: string,
  end: string,
  display: (day: CalendarMonthViewDay) => boolean,
  value: boolean,
  description: { true: string, false: string }
}>>, 'id' | 'title' | 'meta'>