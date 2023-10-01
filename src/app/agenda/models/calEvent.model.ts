import { CalendarEvent } from "angular-calendar";

export enum CalEventType {
  COMMENT = 'comment',
  ANNIVERSAIRE = 'anniversaire',
  FAMILY = 'family'
}

export type CalEventField = Pick<CalendarEvent<Partial<{
  type: CalEventType,
  start: string,
  end: string,
  daysWhenHoliday: number[],
  daysWhenNotHoliday: number[],
  value: boolean,
  description: string,
}>>, 'id' | 'title' | 'meta'>