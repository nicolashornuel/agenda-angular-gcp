import { CalendarCheckbox, CalendarConfirmed, CalendarTypeEnum } from '@agenda/models/agenda.model';
import { CalendarCheckboxService } from '@agenda/services/agenda.firestore.service';
import { Component, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { EditController } from '@shared/abstracts/abstract-editController.directive';
import { DataField, DataSelect, FieldSet } from '@shared/models/fieldSet.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent extends EditController<CalendarConfirmed> {
  private calendarCheckboxService = inject(CalendarCheckboxService);
  public titleField!: DataSelect<String>;
  public startAtField!: FieldSet;
  public typeField!: DataSelect<CalendarTypeEnum>;
  public isLoading = false;
  public inputForm: any;
  private calendarCheckboxList!: CalendarCheckbox[];

  protected override initComponents(): void {
    this.isLoading = true;
    this.calendarCheckboxService
      .getAll()
      .pipe(take(1))
      .subscribe(calendarCheckboxList => {
        this.calendarCheckboxList = calendarCheckboxList;
        this.startAtField = new DataField(CalendarConfirmed.START);
        this.titleField = new DataSelect(
          CalendarConfirmed.TITLE,
          calendarCheckboxList.map(calendarCheckbox => ({
            name: calendarCheckbox.name,
            value: calendarCheckbox.id
          }))
        );
        this.typeField = new DataSelect(
          CalendarConfirmed.TYPE,
          Object.values(CalendarTypeEnum).map(item => ({
            name: item,
            color: CalendarConfirmed.toColor(item)
          }))
        );

        this.inputForm = {
          id: this.input.id,
          start: this.input.start,
          title: { name: this.input.title, value: this.input.checkboxId },
          type: this.input.type
        };
        this.isLoading = false;
      });
  }

  public override onSave(): void {
    const entity: CalendarConfirmed = {
      id: this.inputForm.id,
      type: this.inputForm.type.name,
      start: Timestamp.fromDate(this.inputForm.start),
      checkboxId: this.calendarCheckboxList.find(
        calendarCheckbox => calendarCheckbox.name === this.inputForm.title.name
      )!.id
    };
    this.output.emit(entity);
    this.modalService.set$(undefined);
  }
}
