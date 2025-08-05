import { CalendarCheckbox, CalendarConfirmed } from '@agenda/models/calEvent.model';
import { CalendarCheckboxService, CalendarConfirmedService } from '@agenda/services/agenda.firestore.service';
import { Component, inject } from '@angular/core';
import { ListController } from '@shared/abstracts/abstract-listController.directive';
import { Selectable } from '@shared/models/fieldSet.model';
import {
  ActionSet,
  CellRenderers,
  ColumnCustom,
  ColumnHtml,
  ColumnSet,
  ColumnString
} from '@shared/models/tableSet.interface';
import { from, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.scss']
})
export class ListEventComponent extends ListController<CalendarConfirmed> {
  public override onCreate(): void {}
  protected override firestoreService = inject(CalendarConfirmedService);
  private calendarCheckboxService = inject(CalendarCheckboxService);
  private calendarCheckboxList: CalendarCheckbox[] = [];

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnString(CalendarConfirmed.TITLE, true),
      new ColumnHtml(CalendarConfirmed.START, true, CellRenderers.toLongDay()),
      new ColumnCustom(CalendarConfirmed.TYPE, true, CellRenderers.toSimpleBadge())
    ];
  }

  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.EDIT, row => this.onOpenModal('Editer un évènement', row)),
      new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm('Supprimer un évènement', row))
    ];
  }

  protected override async initData(): Promise<void> {
    this.calendarCheckboxService
      .getList()
      .pipe(take(1))
      .subscribe(calendarCheckboxList => {
        this.calendarCheckboxList = calendarCheckboxList;
        this.tableSet.height = 'calc(100vh - 272px)';
        super.initColSorted({ fieldPath: 'start', directionStr: 'asc' });
        super.initPagination();
        super.initDataFilter(
          this.calendarCheckboxList.map(
            calendarCheckbox => new Selectable(calendarCheckbox.name, {key: 'checkboxId', value: calendarCheckbox.id!})
          )
        );
      });
  }

  protected override toDto(entities: CalendarConfirmed[]) {
    return entities.map(calendarConfirmed => ({
      id: calendarConfirmed.id,
      title: this.calendarCheckboxList.find(checkbox => checkbox.id === calendarConfirmed.checkboxId)?.name,
      start: calendarConfirmed.start.toDate(),
      type: { name: calendarConfirmed.type, color: CalendarConfirmed.toColor(calendarConfirmed.type) }
    }));
  }
}
