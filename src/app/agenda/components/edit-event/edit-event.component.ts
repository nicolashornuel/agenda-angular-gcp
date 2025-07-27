import { CalEventEntity, CalEventTypeEnum, CalRecurringEvent } from '@agenda/models/calEvent.model';
import { CalRecurringEventService } from '@agenda/services/agenda.firestore.service';
import { Component, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { EditController } from '@shared/abstracts/abstract-editController.directive';
import { DataField, DataList, DataSelect, FieldSet } from '@shared/models/fieldSet.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent extends EditController<any> {
  private calRecurringEventService = inject(CalRecurringEventService);
  public titleField!: DataSelect<any>;
  public startAtField!: FieldSet;
  public endAtField!: FieldSet;
  public typeField!: DataSelect<CalEventTypeEnum>;
  public isLoading = false;

  protected override initComponents(): void {
    this.isLoading = true;
    this.calRecurringEventService
      .getDocs$()
      .pipe(take(1))
      .subscribe(calRecurringEvents => {
        this.startAtField = new DataField(CalEventEntity.START_AT);
        this.endAtField = new DataField(CalEventEntity.END_AT);
        this.titleField = new DataSelect(
          CalEventEntity.TITLE,
          calRecurringEvents.map(calRecurringEvent => ({
            name: CalRecurringEvent.toTitle(calRecurringEvent),
            value: CalRecurringEvent.toTitle(calRecurringEvent)
          }))
        );
        this.typeField = new DataSelect(
          CalEventEntity.TYPE,
          Object.values(CalEventTypeEnum).map(item => ({
            name: item,
            color: CalEventEntity.toColor(item)
          }))
        );
        this.isLoading = false;
      });
  }

  public override onSave(): void {
    const entity: CalEventEntity = {
      id: this.input.id,
      title: this.input.title.name,
      meta: {
        type: this.input.type.name,
        start: Timestamp.fromDate(this.input.start),
        end: Timestamp.fromDate(this.input.end)
      }
    };
    this.output.emit(entity);
    this.modalService.set$(undefined);
  }
}
