import { CalendarBirthday } from '@agenda/models/agenda.model';
import { CalendarBirthdayService } from '@agenda/services/agenda.firestore.service';
import { Component, inject } from '@angular/core';
import { ListController } from '@shared/abstracts/abstract-listController.directive';
import { ActionSet, CellRenderers, ColumnHtml, ColumnSet, ColumnString } from '@shared/models/tableSet.interface';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-birthday',
  templateUrl: './list-birthday.component.html',
  styleUrls: ['./list-birthday.component.scss']
})
export class ListBirthdayComponent extends ListController<CalendarBirthday> {
  protected override firestoreService = inject(CalendarBirthdayService);

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnString(CalendarBirthday.NAME, true),
      new ColumnString(CalendarBirthday.DAY, true),
      new ColumnHtml(CalendarBirthday.MONTH, true, CellRenderers.toMonthName()),
      new ColumnString(CalendarBirthday.YEAR, true),

    ];
  }
  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.EDIT, row => this.onOpenModal("Editer un rappel d'anniversaire", row)),
      new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm("Supprimer un rappel d'anniversaire", row))
    ];
  }
  protected override initData(): void {
    this.tableSet.height = 'calc(100vh - 272px)';
    this.isLoading = true;
    this.firestoreService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(calBirthdays => {
        this.tableSet.data = calBirthdays.length > 0 ? this.utilService.sortInByAsc(this.utilService.sortInByAsc(calBirthdays, 'day'), 'month') : [];
        this.isLoading = false;
      });
  }

  public override onCreate(): void {
    this.onOpenModal("Créer un rappel d'anniversaire", new CalendarBirthday());
  }
}
