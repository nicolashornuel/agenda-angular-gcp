import { CalendarCheckbox, CalendarConfirmed } from '@agenda/models/agenda.model';
import { CalendarCheckboxService, CalendarConfirmedService } from '@agenda/services/agenda.firestore.service';
import { Component, inject } from '@angular/core';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { ListController } from '@shared/abstracts/abstract-listController.directive';
import { Nameable, Selectable } from '@shared/models/fieldSet.model';
import {
  ActionSet,
  CellRenderers,
  ColumnCustom,
  ColumnHtml,
  ColumnSet,
  ColumnString
} from '@shared/models/tableSet.interface';
import { take } from 'rxjs';

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
            calendarCheckbox =>
              new Selectable(calendarCheckbox.name, { key: 'checkboxId', value: calendarCheckbox.id! })
          )
        );
      });
    this.initPeriod();
  }

  protected override toDto(entities: CalendarConfirmed[]) {
    return entities.map(calendarConfirmed => ({
      id: calendarConfirmed.id,
      checkboxId: this.calendarCheckboxList.find(checkbox => checkbox.id === calendarConfirmed.checkboxId)?.name || calendarConfirmed.title,
      start: calendarConfirmed.start.toDate(),
      type: { name: calendarConfirmed.type, color: CalendarConfirmed.toColor(calendarConfirmed.type) }
    }));
  }

  //////////////////////////////////////////// DELETE BY PERIOD ////////////////////////////////////////////

  public period!: { startAt: Date; endAt: Date };
  public isLocked = true;

  private initPeriod(): void {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    this.period = {
      startAt: date,
      endAt: new Date()
    };
  }

  public onPeriodFilter(): void {
    this.isLoading = true;
    this.firestoreService
      .findByDateRange('start', new Date(this.period.startAt), new Date(this.period.endAt))
      .pipe(take(1))
      .subscribe(items => this.defineData({ items: items, hasNext: false, hasPrevious: false }));
  }

  @IsAdmin()
  public onPeriodDelete(): void {
    this.isLoading = true;
    let promises = this.tableSet.data.map((item: Identifiable) => this.firestoreService.delete(item.id!));
    Promise.all(promises)
      .then(() => {
        this.isLoading = false;
        this.tableSet.data = [];
      })
      .catch(() => {
        this.isLoading = false;
      });
  }
}
