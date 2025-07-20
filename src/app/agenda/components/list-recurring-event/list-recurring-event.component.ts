import { CalRecurringEvent, CalRecurringEventDto, CalRecurringEventType } from '@agenda/models/calEvent.model';
import { CalRecurringEventService } from '@agenda/services/agenda.firestore.service';
import { CalRecurringEvent$, CalRecurringEventType$ } from '@agenda/services/agenda.observable.service';
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
import { UtilService } from '@shared/services/util.service';
import { combineLatest, takeUntil } from 'rxjs';
import { AgendaUser } from '../tab-recurrent-event/tab-recurrent-event.component';

@Component({
  selector: 'app-list-recurring-event',
  templateUrl: './list-recurring-event.component.html',
  styleUrls: ['./list-recurring-event.component.scss']
})
export class ListRecurringEventComponent extends ListController<CalRecurringEvent> {
  protected override firestoreService = inject(CalRecurringEventService);
  private calRecurringEventType$ = inject(CalRecurringEventType$);
  private calRecurringEvent$ = inject(CalRecurringEvent$);
  private utilService = inject(UtilService);

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnCustom(CalRecurringEvent.CAL_RECURRING_EVENT_TYPE, true, CellRenderers.toSimpleBadge()).setWidth("40%"),
      new ColumnHtml(CalRecurringEvent.AGENDA_USER, true, CellRenderers.toName()).setWidth("40%"),
      new ColumnString(CalRecurringEvent.ORDER, true)
    ];
  }

  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.EDIT, row => this.onOpenModal('Editer un évènement récurrent', row)),
      new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm('Supprimer un évènement récurrent', row))
    ];
  }

  protected override initData(): void {
    this.tableSet.height = 'auto';
    combineLatest([this.calRecurringEventType$.get$, this.calRecurringEvent$.get$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([recurrentEventTypes, recurrentEvents]) => {
        let list = recurrentEvents
          .map((event: CalRecurringEvent) => {
            const type = recurrentEventTypes.find(
              (type: CalRecurringEventType) => type.id === event.calRecurringEventTypeId
            );
            const agendaUser = AgendaUser.AGENDA_USERS.find(user => user.id === event.agendaUserId);
            return this.toDto(event, type, agendaUser!);
          });
          this.tableSet.data = this.utilService.sortInByAsc(list, 'order');
      });
  }

  public override onCreate(): void {
    const lastOrder = Math.max(...this.tableSet.data.map(feed => feed.order || 0));
    this.onOpenModal('Créer un évènement récurrent', new CalRecurringEventDto(lastOrder + 1));
  }

  public override onSave(t: CalRecurringEvent): Promise<void> {
    const entity = this.toEntity(t as unknown as CalRecurringEventDto);
    return super.onSave(entity);
  }

  private toEntity(dto: CalRecurringEventDto): CalRecurringEvent {
    let entity: CalRecurringEvent = {
      agendaUserId: dto.agendaUser.id,
      calRecurringEventTypeId: dto.calRecurringEventType.id!,
      order: dto.order
    };
    if (dto.id) entity.id = dto.id;

    return entity;
  }

  private toDto(
    entity: CalRecurringEvent,
    calRecurringEventType: CalRecurringEventType,
    agendaUser: AgendaUser
  ): CalRecurringEventDto {
    return {
      id: entity.id,
      agendaUser: agendaUser,
      calRecurringEventType: calRecurringEventType,
      order: entity.order || 0
    };
  }
}
