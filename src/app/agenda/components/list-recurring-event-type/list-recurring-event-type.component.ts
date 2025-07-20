import { CalRecurringEventRule, CalRecurringEventType } from '@agenda/models/calEvent.model';
import { CalRecurringEventTypeService } from '@agenda/services/agenda.firestore.service';
import { CalRecurringEventType$ } from '@agenda/services/agenda.observable.service';
import { Component, inject } from '@angular/core';
import { ListController } from '@shared/abstracts/abstract-listController.directive';
import { ActionSet, ColumnHtml, ColumnSet, ColumnString } from '@shared/models/tableSet.interface';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-recurring-event-type',
  templateUrl: './list-recurring-event-type.component.html',
  styleUrls: ['./list-recurring-event-type.component.scss']
})
export class ListRecurringEventTypeComponent extends ListController<CalRecurringEventType> {
  protected override firestoreService = inject(CalRecurringEventTypeService);
  private calRecurringEventType$ = inject(CalRecurringEventType$);

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnString(CalRecurringEventType.NAME, true),
      new ColumnString(CalRecurringEventType.DESCRIPTION, true).setWidth('30%'),
      new ColumnString(CalRecurringEventType.START_AT, true),
      new ColumnString(CalRecurringEventType.END_AT, true),
      new ColumnHtml(CalRecurringEventType.RULES, true, (row: any, col: ColumnSet) =>
        CalRecurringEventRule.toString(row[col.key])
      )
    ];
  }
  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.EDIT, row => this.onOpenModal("Editer un type d'évènement", row)),
      new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm("Supprimer un type d'évènement", row))
    ];
  }
  protected override initData(): void {
    this.tableSet.height = 'auto';
    this.calRecurringEventType$.get$.pipe(takeUntil(this.destroy$)).subscribe(types => {
      this.tableSet.data = types;
    });
  }

  public override onCreate(): void {
    this.onOpenModal("Créer un type d'évènement", new CalRecurringEventType());
  }
}
