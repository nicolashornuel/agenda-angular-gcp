import { CalRecurringEvent, CalRecurringEventDto, CalRecurringEventType } from '@agenda/models/calEvent.model';
import { CalRecurringEventType$ } from '@agenda/services/agenda.observable.service';
import { Component, inject } from '@angular/core';
import { EditController } from '@shared/abstracts/abstract-editController.directive';
import { DataField, DataSelect, FieldSet } from '@shared/models/fieldSet.model';
import { take } from 'rxjs';
import { AgendaUser } from '../tab-recurrent-event/tab-recurrent-event.component';

@Component({
  selector: 'app-edit-recurring-event',
  templateUrl: './edit-recurring-event.component.html',
  styleUrls: ['./edit-recurring-event.component.scss']
})
export class EditRecurringEventComponent extends EditController<CalRecurringEventDto> {
  public agendaUserField!: DataSelect<AgendaUser>;
  public calRecurringEventTypeField!: DataSelect<CalRecurringEventType>;
  public orderField!: FieldSet;
  private calRecurringEventType$ = inject(CalRecurringEventType$);

  protected override initComponents(): void {
    this.calRecurringEventType$.get$.pipe(take(1)).subscribe((types: CalRecurringEventType[]) => {
      this.agendaUserField = new DataSelect<AgendaUser>(CalRecurringEvent.AGENDA_USER, AgendaUser.AGENDA_USERS);
      this.calRecurringEventTypeField = new DataSelect<CalRecurringEventType>(
        CalRecurringEvent.CAL_RECURRING_EVENT_TYPE,
        types
      );
      this.orderField = new DataField(CalRecurringEvent.ORDER);
    });
  }
}
