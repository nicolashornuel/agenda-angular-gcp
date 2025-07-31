import { CalRecurringEvent } from '@agenda/models/calEvent.model';
import { CalRecurringEventService } from '@agenda/services/agenda.firestore.service';
import { CalRecurringEvent$ } from '@agenda/services/agenda.observable.service';
import { Component, inject } from '@angular/core';
import { ListController } from '@shared/abstracts/abstract-listController.directive';
import {
  ActionSet,
  CellRenderers,
  ColumnCustom,
  ColumnHtml,
  ColumnSet,
  ColumnString
} from '@shared/models/tableSet.interface';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-recurring-event',
  templateUrl: './list-recurring-event.component.html',
  styleUrls: ['./list-recurring-event.component.scss']
})
export class ListRecurringEventComponent extends ListController<CalRecurringEvent> {
  protected override firestoreService = inject(CalRecurringEventService);
  private calRecurringEvent$ = inject(CalRecurringEvent$);

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnString(CalRecurringEvent.NAME, true).setWidth('25%'),
      new ColumnHtml(CalRecurringEvent.AGENDA_USER, true, CellRenderers.toName()).setWidth('25%'),
      new ColumnCustom(CalRecurringEvent.CAL_RECURRING_EVENT_TYPE, true, CellRenderers.toSimpleBadge()).setWidth('25%'),
      new ColumnString(CalRecurringEvent.ORDER, true).setWidth('15%')
    ];
  }

  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.EDIT, row => this.onOpenModal('Editer un évènement récurrent', row)),
      new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm('Supprimer un évènement récurrent', row))
    ];
  }

  protected override async initData(): Promise<void> {
    this.tableSet.height = 'auto';
    this.isLoading = true;
    this.calRecurringEvent$.get$.pipe(takeUntil(this.destroy$)).subscribe(recurrentEvents => {
      this.tableSet.data = recurrentEvents.length > 0 ? this.utilService.sortInByAsc(recurrentEvents, 'order') : [];
      this.isLoading = false;
    });
  }

  public override onCreate(): void {
    const lastOrder = this.tableSet.data.reduce((max, feed) => Math.max(max, feed.order || 0), 0);
    this.onOpenModal('Créer un évènement récurrent', new CalRecurringEvent(lastOrder + 1));
  }
}
