import { CalendarEvent } from "angular-calendar";
import { Timestamp } from '@firebase/firestore';

export enum CalEventType {
  COMMENT = 'comment',
  ANNIVERSAIRE = 'anniversaire',
  FAMILY = 'family'
}

export type CalEventEntity = Pick<CalendarEvent<{
  type: CalEventType,
  start: number | Object | Date | Timestamp,
  end?: number | Object | Date | Timestamp,
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