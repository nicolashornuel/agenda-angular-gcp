import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { Color } from '@shared/models/color.enum';
import { Nameable } from '@shared/models/fieldSet.model';
import { CalendarEvent } from 'angular-calendar';

export enum CalEventTypeEnum {
  COMMENT = 'comment',
  ANNIVERSAIRE = 'anniversaire',
  FAMILY = 'family'
}

export type CalendarEventType= CalendarEvent<
  Partial<{
    type: CalEventTypeEnum;
  }>
>;

/* export interface CalEventEntity
  extends Identifiable,
    Pick<
      CalendarEvent<{
        type: CalEventTypeEnum;
        start: Timestamp;
        end?: Timestamp;
      }>,
      'title' | 'meta'
    > {}


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

export interface CalCheckboxEvent
  extends Pick<
    CalendarEvent<{
      type: CalEventTypeEnum;
      start: string;
      end: string;
      value?: boolean;
      rules: Record<string, boolean[]>;
      calRecurringEventId: string;
    }>,
    'id' | 'title' | 'meta'
  > {} */

export class CalRecurringEventRuleCondition {
  public static readonly DEFAULT = { key: 'DEFAULT', name: 'Défaut' };
  public static readonly HOLIDAY = { key: 'HOLIDAY', name: 'Vacance' };
  public static readonly NOT_HOLIDAY = { key: 'NOT_HOLIDAY', name: 'Période scolaire' };
  public static readonly PUBLIC_HOLIDAY = { key: 'PUBLIC_HOLIDAY', name: 'Férié' };
  public static readonly CONDITIONS = [
    { key: 'DEFAULT', name: 'Défaut' },
    { key: 'HOLIDAY', name: 'Vacance' },
    { key: 'NOT_HOLIDAY', name: 'Période scolaire' },
    { key: 'PUBLIC_HOLIDAY', name: 'Férié' }
  ];
}

export class CalRecurringEventRule {
  public static readonly CONDITION = { key: 'condition', name: 'Type de condition' };
  public static readonly DAYS_OF_WEEK = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  constructor() {
    for (let i = 0; i < 7; i++) {
      this[i] = false; // Initialise les index 0 à 6
    }
    this.condition = CalRecurringEventRuleCondition.DEFAULT;
  }

  public static toArray(rules: Record<string, boolean[]>): CalRecurringEventRule[] {
    return Object.keys(rules).map((rule, i) => {
      const days = Object.values(rules)[i] as boolean[];
      return {
        condition: CalRecurringEventRuleCondition.CONDITIONS.find(condition => condition.key === rule)!,
        0: days[0] ?? false,
        1: days[1] ?? false,
        2: days[2] ?? false,
        3: days[3] ?? false,
        4: days[4] ?? false,
        5: days[5] ?? false,
        6: days[6] ?? false
      };
    });
  }

  public static toRecord(rules: CalRecurringEventRule[]): Record<string, boolean[]> {
    return Object.fromEntries(
      new Map<string, boolean[]>(
        (rules as CalRecurringEventRule[]).map(rule => [
          rule.condition.key,
          CalRecurringEventRule.DAYS_OF_WEEK.map((_day, i) => Object.values(rule)[i] as boolean)
        ])
      )
    );
  }

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

export interface Orderable {
  order: number;
}

export interface CalRecurringEventRule {
  condition: { key: string; name: string };
  [key: number]: boolean;
}

export interface AgendaUserGroup extends Identifiable, Nameable {
  agendaUser?: DocumentReference<AgendaUser>[];
}

export interface AgendaUser extends Identifiable, Nameable {
  agendaUserGroup: AgendaUserGroup | DocumentReference<AgendaUserGroup>;
  uid?: string;
}

export interface CalendarBirthday extends Identifiable, Nameable {
  day: number;
  month: number;
  year?: number;
}

export class CalendarBirthday {
  public static readonly NAME = { key: 'name', name: 'Titre' };
  public static readonly DAY = { key: 'day', name: 'Jour' };
  public static readonly MONTH = { key: 'month', name: 'Mois' };
  public static readonly YEAR = { key: 'year', name: 'Année' };
}

export interface CalendarCheckbox extends Identifiable, Nameable, Orderable {
  rules: Record<string, boolean[]> | CalRecurringEventRule[];
  description: string;
  group: string;
  value?: boolean;
}

export class CalendarCheckbox {
  public static readonly NAME = { key: 'name', name: 'Titre' };
  public static readonly ORDER = { key: 'order', name: 'Ordre d\'affichage' };
  public static readonly RULES = { key: 'rules', name: 'Règles' };
  public static readonly GROUP = { key: 'group', name: 'Famille' };
  public static readonly DESCRIPTION = { key: 'description', name: 'Description' };
  constructor(order: number) {
    this.order = order;
    this.name = '';
    this.description = '';
    this.rules = [];
  }
}

export interface CalendarConfirmed extends Identifiable {
  start: Timestamp;
  type: CalEventTypeEnum;
  title?: string;
  checkboxId?: string;
}

export class CalendarConfirmed {
  public static readonly TYPE = { key: 'type', name: 'Type' };
  public static readonly START = { key: 'start', name: 'Date' };
  public static readonly TITLE = { key: 'title', name: 'Titre' };

  public static toColor(type: CalEventTypeEnum): Color {
    switch (type) {
      case CalEventTypeEnum.FAMILY:
        return Color.ORANGE;
      case CalEventTypeEnum.COMMENT:
        return Color.BLUE;
      default:
        return Color.LIGHT;
    }
  }
}