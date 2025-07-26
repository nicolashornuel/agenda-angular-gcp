import { CalEventEntity } from '@agenda/models/calEvent.model';
import { CalEventService } from '@agenda/services/agenda.firestore.service';
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

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.scss']
})
export class ListEventComponent extends ListController<CalEventEntity> {
  public override onCreate(): void {}
  protected override firestoreService = inject(CalEventService);

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnString(CalEventEntity.TITLE, true).setWidth('40%'),
      new ColumnHtml(CalEventEntity.START_AT, true, CellRenderers.toShortDate()),
      new ColumnHtml(CalEventEntity.END_AT, true, CellRenderers.toShortDate()),
      new ColumnCustom(CalEventEntity.TYPE, true, CellRenderers.toSimpleBadge())
    ];
  }

  protected override getActionSet(): ActionSet[] {
    return [new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm('Supprimer un évènement', row))];
  }

  protected override async initData(): Promise<void> {
    this.tableSet.height = 'calc(100vh - 272px)';
    super.initColSorted({ fieldPath: 'meta.start', directionStr: 'asc' });
    super.initPagination();
    super.initDataFilter((entities: CalEventEntity[]) => {
      const set = new Set(entities.map(entity => entity.meta!.type.toString()));
      return [...set].map(type => new Selectable(type, 'meta.type'));
    });
  }

  protected override toDto(entities: CalEventEntity[]) {
    return entities.map(calEventEntity => ({
      id: calEventEntity.id,
      title: calEventEntity.title,
      start: calEventEntity.meta!.start.toDate(),
      end: calEventEntity.meta!.end?.toDate(),
      type: { name: calEventEntity.meta!.type, color: CalEventEntity.toColor(calEventEntity.meta!.type) }
    }));
  }
}
