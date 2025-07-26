import { AgendaUserService, CalRecurringEventService, CalRecurringEventTypeService } from '@agenda/services/agenda.firestore.service';
import { AgendaUser$, CalRecurringEvent$, CalRecurringEventType$ } from '@agenda/services/agenda.observable.service';
import { Component, inject, OnInit } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { combineLatest, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tab-recurrent-event',
  templateUrl: './tab-recurrent-event.component.html',
  styleUrls: ['./tab-recurrent-event.component.scss']
})
export class TabRecurrentEventComponent implements OnInit {
  public isLoading = false;
  private calRecurringEventTypeService = inject(CalRecurringEventTypeService);
  private calRecurringEventService = inject(CalRecurringEventService);
  private agendaUserService = inject(AgendaUserService);
  private calRecurringEventType$ = inject(CalRecurringEventType$);
  private calRecurringEvent$ = inject(CalRecurringEvent$);
  private agendaUser$ = inject(AgendaUser$);
  private destroy$ = inject(DestroyService);

  ngOnInit(): void {
    this.isLoading = true;
    combineLatest([
      this.calRecurringEventTypeService.getAll(),
      this.agendaUserService.getAll(),
      this.calRecurringEventService.getDocs$()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([recurrentEventTypes, agendaUsers, recurrentEvents]) => {
        this.calRecurringEventType$.set$(recurrentEventTypes);
        this.calRecurringEvent$.set$(recurrentEvents);
        this.agendaUser$.set$(agendaUsers);
        this.isLoading = false;
      });
  }
}
