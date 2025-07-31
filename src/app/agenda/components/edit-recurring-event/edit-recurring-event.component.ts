import { AgendaUser, CalRecurringEvent, CalRecurringEventType } from '@agenda/models/calEvent.model';
import { AgendaUser$, CalRecurringEventType$ } from '@agenda/services/agenda.observable.service';
import { Component, inject } from '@angular/core';
import { EditController } from '@shared/abstracts/abstract-editController.directive';
import { DataField, DataSelect, FieldSet } from '@shared/models/fieldSet.model';
import { combineLatest, take } from 'rxjs';

@Component({
  selector: 'app-edit-recurring-event',
  templateUrl: './edit-recurring-event.component.html',
  styleUrls: ['./edit-recurring-event.component.scss']
})
export class EditRecurringEventComponent extends EditController<CalRecurringEvent> {
  public agendaUserField!: DataSelect<AgendaUser>;
  public calRecurringEventTypeField!: DataSelect<CalRecurringEventType>;
  public orderField!: FieldSet;
  public nameField!: FieldSet;
  private calRecurringEventType$ = inject(CalRecurringEventType$);
  private agendaUser$ = inject(AgendaUser$);

  protected override initComponents(): void {
    combineLatest([this.calRecurringEventType$.get$, this.agendaUser$.get$])
      .pipe(take(1))
      .subscribe(([recurrentEventTypes, agendaUsers]) => {
        this.agendaUserField = new DataSelect<AgendaUser>(CalRecurringEvent.AGENDA_USER, agendaUsers);
        this.calRecurringEventTypeField = new DataSelect<CalRecurringEventType>(
          CalRecurringEvent.CAL_RECURRING_EVENT_TYPE,
          recurrentEventTypes
        );
        this.orderField = new DataField(CalRecurringEvent.ORDER);
        this.nameField = new DataField(CalRecurringEvent.NAME);
      });
  }
}
