import { Timestamp } from '@angular/fire/firestore';
import { CalendarEvent } from "angular-calendar";

export enum CalEventType {
  COMMENT = 'comment',
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
  daysWhenHoliday: number[],
  daysWhenNotHoliday: number[],
  value: boolean,
  description: string,
}>>, 'id' | 'title' | 'meta'>