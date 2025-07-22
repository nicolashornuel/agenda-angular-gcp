import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { Nameable, Selectable } from '@shared/models/fieldSet.model';
import { CalendarEvent } from 'angular-calendar';

export enum CalEventTypeEnum {
  COMMENT = 'comment',
  ANNIVERSAIRE = 'anniversaire',
  FAMILY = 'family'
}

export type CalEventEntity = Pick<
  CalendarEvent<{
    type: CalEventTypeEnum;
    start: Timestamp;
    end?: Timestamp;
  }>,
  'id' | 'title' | 'meta'
>;

export type CalEventDTO = CalendarEvent<
  Partial<{
    type: CalEventTypeEnum;
  }>
>;

export type CalEventField = Pick<
  CalendarEvent<
    Partial<{
      type: CalEventTypeEnum;
      start: string;
      end: string;
      daysWhenHoliday: number[];
      daysWhenNotHoliday: number[];
      daysWhenPublicHoliday: number[];
      value: boolean;
      description: string;
    }>
  >,
  'id' | 'title' | 'meta'
>;

export class CalRecurringEventType implements Selectable<string>, Identifiable {
  public static readonly NAME = { key: 'name', name: 'Titre' };
  public static readonly START_AT = { key: 'startAt', name: 'Début' };
  public static readonly END_AT = { key: 'endAt', name: 'Fin' };
  public static readonly RULES = { key: 'rules', name: 'Règles' };
  public static readonly DESCRIPTION = { key: 'description', name: 'Description' };

  constructor() {
    this.name = '';
    this.startAt = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    this.endAt = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    this.rules = [];
    this.description = '';
  }
  id: string | undefined;
  name: string;
  startAt: string;
  endAt: string;
  rules: CalRecurringEventRule[];
  description: string;
}

export class CalRecurringEventRule {
  public static readonly CONDITION = { key: 'condition', name: 'Type de condition' };
  public static readonly DAYS_OF_WEEK = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  0 = false; // Dimanche
  1 = false;
  2 = false;
  3 = false;
  4 = false;
  5 = false;
  6 = false;

  condition = { key: 'DEFAULT', name: 'Défaut' };

  public static readonly CONDITIONS = [
    { key: 'DEFAULT', name: 'Défaut' },
    { key: 'HOLIDAY', name: 'Si Vacance' },
    { key: 'NOT_HOLIDAY', name: 'Si Hors vacance' },
    { key: 'PUBLIC_HOLIDAY', name: 'Si Férié' }
  ];

  public static toString(rules: CalRecurringEventRule[]): string {
    return rules
      .map(
        rule =>
          `<strong>${rule.condition.name}:</strong> ${[0, 1, 2, 3, 4, 5, 6]
            .map(index => (rule as any)[index] ?? false)
            .map((day, index) => (day ? CalRecurringEventRule.DAYS_OF_WEEK[index] : ''))
            .filter(day => day !== '')
            .join(', ')}`
      )
      .join('<br/>');
  }
}

export class CalRecurringEvent {
  public static readonly AGENDA_USER = { key: 'agendaUser', name: 'Qui' };
  public static readonly CAL_RECURRING_EVENT_TYPE = { key: 'calRecurringEventType', name: 'Type' };
  public static readonly ORDER = { key: 'order', name: 'ordre' };
  constructor(order: number) {
    this.order = order;
  }
}

export interface Orderable {
  order: number;
}

export interface CalRecurringEvent extends Identifiable, Orderable {
  agendaUser: AgendaUser | DocumentReference<AgendaUser>;
  calRecurringEventType: CalRecurringEventType | DocumentReference<CalRecurringEventType>;
}

export interface AgendaUserGroup extends Identifiable, Nameable {
  agendaUser?: DocumentReference<AgendaUser>[];
}

export interface AgendaUser extends Identifiable, Nameable {
  agendaUserGroup: AgendaUserGroup | DocumentReference<AgendaUserGroup>;
  uid?: string;
}

