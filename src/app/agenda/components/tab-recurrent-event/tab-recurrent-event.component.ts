import { CalRecurringEvent, CalRecurringEventRule, CalRecurringEventType } from '@agenda/models/calEvent.model';
import { CalRecurringEventService, CalRecurringEventTypeService } from '@agenda/services/agenda.firestore.service';
import { CalRecurringEventType$, CalRecurringEvent$ } from '@agenda/services/agenda.observable.service';
import { Component, inject, OnInit } from '@angular/core';
import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { Selectable } from '@shared/models/fieldSet.model';
import { DestroyService } from '@shared/services/destroy.service';
import { combineLatest, takeUntil } from 'rxjs';

class RecurringEvent {
  public static readonly USER = { key: 'user', name: 'Utilisateur' };
  public static readonly TYPE = { key: 'type', name: 'Type' };
  public static readonly START_AT = { key: 'startAt', name: 'Début' };
  public static readonly END_AT = { key: 'endAt', name: 'Fin' };
  public static readonly RULES = { key: 'rules', name: 'Règles' };
  public static readonly DESCRIPTION = { key: 'description', name: 'Description' };

  constructor() {
    this.user = '';
    this.type = '';
    this.startAt = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    this.endAt = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    this.rules = [];
    this.description = '';
  }
  id?: string;
  user: string;
  type: string;
  startAt: string;
  endAt: string;
  rules: CalRecurringEventRule[];
  description: string;
}

class AgendaUserGroup implements Identifiable {
  public static readonly NAME = { key: 'name', name: 'Nom' };
  constructor(public readonly id: string, public readonly name: string) {}
}
export class AgendaUser implements Selectable<string>, Identifiable {
  public static readonly NAME = { key: 'name', name: 'Nom' };
  public static readonly AGENDA_USER_GROUP = { key: 'agendaUserGroup', name: 'Groupe' };

  agendaUserGroup?: string;

  constructor(public readonly id: string, public readonly name: string) {}

  public static readonly AGENDA_USERS: AgendaUser[] = [
    { id: '1', name: 'Baptiste', agendaUserGroup: '1' },
    { id: '2', name: 'Romane', agendaUserGroup: '1' },
    { id: '3', name: 'Emilie', agendaUserGroup: '1' },
    { id: '4', name: 'Nicolas', agendaUserGroup: '1' }
  ];
}

const AGENDA_USERS_GROUP: AgendaUserGroup[] = [{ id: '1', name: 'HORNUEL_FAMILY' }];

@Component({
  selector: 'app-tab-recurrent-event',
  templateUrl: './tab-recurrent-event.component.html',
  styleUrls: ['./tab-recurrent-event.component.scss']
})
export class TabRecurrentEventComponent implements OnInit {
  public isLoading = false;
  private calRecurringEventTypeService = inject(CalRecurringEventTypeService);
  private calRecurringEventService = inject(CalRecurringEventService);
  private calRecurringEventType$ = inject(CalRecurringEventType$);
  private calRecurringEvent$ = inject(CalRecurringEvent$);
  private destroy$ = inject(DestroyService);

  ngOnInit(): void {
    this.isLoading = true;
    combineLatest([this.calRecurringEventTypeService.getAll(), this.calRecurringEventService.getAll()])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([recurrentEventTypes, recurrentEvents]) => {
        this.calRecurringEventType$.set$(recurrentEventTypes);
        this.calRecurringEvent$.set$(recurrentEvents);
        this.isLoading = false;
      });
  }
}
