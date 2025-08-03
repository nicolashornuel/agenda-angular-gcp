import { CalendarCheckbox, CalRecurringEventRule } from '@agenda/models/calEvent.model';
import { CalendarCheckboxService } from '@agenda/services/agenda.firestore.service';
import { Component, inject } from '@angular/core';
import { ListController } from '@shared/abstracts/abstract-listController.directive';
import { ColumnSet, ColumnString, ColumnHtml, ActionSet } from '@shared/models/tableSet.interface';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-checkbox',
  templateUrl: './list-checkbox.component.html',
  styleUrls: ['./list-checkbox.component.scss']
})
export class ListCheckboxComponent extends ListController<CalendarCheckbox> {
  protected override firestoreService = inject(CalendarCheckboxService);

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnString(CalendarCheckbox.NAME, true),
      new ColumnString(CalendarCheckbox.DESCRIPTION, true).setWidth('30%'),
      new ColumnHtml(CalendarCheckbox.RULES, true, (row: any, col: ColumnSet) =>
        CalRecurringEventRule.toString(row[col.key])
      ),
      new ColumnString(CalendarCheckbox.ORDER, true).setWidth('15%')
    ];
  }
  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.EDIT, row => this.onOpenModal("Editer un type d'évènement", row)),
      new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm("Supprimer un type d'évènement", row))
    ];
  }
  protected override initData(): void {
    this.tableSet.height = 'calc(100vh - 272px)';
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
    this.onOpenModal('Créer un évènement récurrent', new CalendarCheckbox(lastOrder + 1));
  }
}
