import { CalendarCheckboxEvent, CalRecurringEvent, CalRecurringEventRule } from '@agenda/models/calEvent.model';
import { CalendarCheckboxEventService } from '@agenda/services/agenda.firestore.service';
import { Component, inject } from '@angular/core';
import { ListController } from '@shared/abstracts/abstract-listController.directive';
import { ActionSet, ColumnHtml, ColumnSet, ColumnString } from '@shared/models/tableSet.interface';
import { map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-checkbox-event',
  templateUrl: './list-checkbox-event.component.html',
  styleUrls: ['./list-checkbox-event.component.scss']
})
export class ListCheckboxEventComponent extends ListController<CalendarCheckboxEvent> {
  protected override firestoreService = inject(CalendarCheckboxEventService);

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnString(CalendarCheckboxEvent.NAME, true),
      new ColumnString(CalendarCheckboxEvent.DESCRIPTION, true).setWidth('30%'),
      new ColumnHtml(CalendarCheckboxEvent.RULES, true, (row: any, col: ColumnSet) =>
        CalRecurringEventRule.toString(row[col.key])
      ),
      new ColumnString(CalendarCheckboxEvent.ORDER, true).setWidth('15%')
    ];
  }
  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.EDIT, row => this.onOpenModal("Editer un type d'évènement", row)),
      new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm("Supprimer un type d'évènement", row))
    ];
  }
  protected override initData(): void {
    this.tableSet.height = 'calc(100vh - 240px)';
    this.isLoading = true;
    this.firestoreService
      .getList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.tableSet.data = items;
        this.isLoading = false;
      });
  }

  public override onCreate(): void {
    const lastOrder = this.tableSet.data.reduce((max, feed) => Math.max(max, feed.order || 0), 0);
    this.onOpenModal('Créer un évènement récurrent', new CalendarCheckboxEvent(lastOrder + 1));
  }
}
