import { Component } from '@angular/core';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { ListController } from '@shared/abstracts/abstract-listController.directive';
import { Color } from '@shared/models/color.enum';
import { Nameable, Selectable } from '@shared/models/fieldSet.model';
import { ActionSet, CellRenderers, ColumnCustom, ColumnSet, ColumnString } from '@shared/models/tableSet.interface';

class RecurringEvent implements Identifiable {
  public static readonly USER = { key: 'user', name: 'Qui' };
  public static readonly START_AT = { key: 'start', name: 'Début' };
  public static readonly END_AT = { key: 'end', name: 'Fin' };
  public static readonly DESCRIPTION = { key: 'description', name: 'Description' };
  public static readonly RULES = { key: 'rules', name: 'Règles' };
  public static readonly TYPE = { key: 'type', name: 'Type' };

  constructor() {
    this.id = '';
    (this.user = { id: '', name: '' }),
      (this.type = { id: '', name: '' }),
      (this.start = ''),
      (this.end = ''),
      (this.rules = []);
    this.description = '';
  }

  id: string | undefined;
  user: User;
  type: EventType;
  start: string;
  end: string;
  rules: EventRule[];
  description: string;
}

export class EventRule implements Selectable<string> {
  constructor(
    public readonly condition: 'DEFAULT' | 'HOLIDAY' | 'NOT_HOLIDAY' | 'PUBLIC_HOLIDAY',
    public readonly daysOfWeek: number[]
  ) {}
  public get value(): string {
    return `${this.condition} (${this.daysOfWeek.join(', ')})`;
  }
  public get name(): string {
    return this.condition;
  }
  public get order(): number {
    return 0; // Default order, can be customized
  }
  public get color(): Color | undefined {
    switch (this.condition) {
      case 'HOLIDAY':
        return Color.GREEN;
      case 'NOT_HOLIDAY':
        return Color.BLUE;
      case 'PUBLIC_HOLIDAY':
        return Color.RED;
      default:
        return undefined; // No specific color for DEFAULT
    }
  }
}

export class EventType implements Selectable<string>, Identifiable {
  constructor(public readonly id: string, public readonly name: string) {}

  /*   public get value(): string {
    return this.name;
  }
 */
  // Méthode pour récupérer toutes les instances statiques
  public static getAll(): EventType[] {
    return Object.values(EventType).filter(v => v instanceof EventType) as EventType[];
  }

  // Trouver une instance par sa value
  /*   public static getType(value: string): EventType | undefined {
    return EventType.getAll().find(type => type.value === value);
  } */
}

export class User implements Selectable<string> {
  constructor(public readonly id: string, public readonly name: string) {}
}

export const EVENTS: RecurringEvent[] = [
  {
    id: '1',
    user: { id: '1', name: 'Baptiste' },
    type: { id: '1', name: 'Centre de loisirs' },
    start: '08:00',
    end: '18:00',
    rules: [new EventRule('HOLIDAY', [1, 2, 4, 5]), new EventRule('NOT_HOLIDAY', [3])],
    description: 'Ouvert pendant les vacances scolaires et mercredi en période scolaire.'
  },
  {
    id: '2',
    user: { id: '1', name: 'Baptiste' },
    type: { id: '2', name: 'Garderie matin' },
    start: '07:30',
    end: '09:00',
    rules: [new EventRule('NOT_HOLIDAY', [1, 2, 4, 5])],
    description: 'Disponible en période scolaire.'
  },
  {
    id: '3',
    user: { id: '1', name: 'Baptiste' },
    type: { id: '3', name: 'Garderie soir' },
    start: '17:00',
    end: '19:00',
    rules: [new EventRule('NOT_HOLIDAY', [1, 2, 4, 5])],
    description: 'Disponible en période scolaire.'
  },
  {
    id: '4',
    user: { id: '1', name: 'Baptiste' },
    type: { id: '4', name: 'Cantine' },
    start: '12:00',
    end: '14:00',
    rules: [new EventRule('NOT_HOLIDAY', [1, 2, 4, 5])],
    description: 'Disponible en période scolaire.'
  }
];

@Component({
  selector: 'app-tab-recurrent-event',
  templateUrl: './tab-recurrent-event.component.html',
  styleUrls: ['./tab-recurrent-event.component.scss']
})
export class TabRecurrentEventComponent extends ListController<RecurringEvent> {
  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnString(RecurringEvent.USER, true),
      new ColumnCustom(RecurringEvent.TYPE, true, CellRenderers.toSimpleBadge()),
      new ColumnString(RecurringEvent.DESCRIPTION, true),
      new ColumnString(RecurringEvent.START_AT, true),
      new ColumnString(RecurringEvent.END_AT, true),
      new ColumnString(RecurringEvent.RULES, true)
    ];
  }

  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.EDIT, row => this.onOpenModal('Editer une réservation', row)),
      new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm('Supprimer une réservation', row))
    ];
  }

  protected override initData(): void {
    this.tableSet.data = EVENTS.map((field: RecurringEvent) => {
      return {
        id: field.id,
        user: field.user.name,
        type: field.type!,
        start: field.start,
        end: field.end,
        rules: field.rules
          .map(rule => {
            return `${rule.condition} (${rule.daysOfWeek.join(', ')})`;
          })
          .join('; '),
        description: field.description
      };
    });
  }

  public override onCreate(): void {
    this.onOpenModal('Créer une réservation', new RecurringEvent());
  }
  public override onSave(t: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @IsAdmin()
  public onConfirmDelete(row: RecurringEvent) {
    this.modalService.set$(undefined);
    this.alertService.success('suppression réussie');
  }
}
