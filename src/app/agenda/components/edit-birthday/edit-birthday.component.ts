import { CalendarBirthday } from '@agenda/models/agenda.model';
import { Component } from '@angular/core';
import { EditController } from '@shared/abstracts/abstract-editController.directive';
import { DataField, FieldSet } from '@shared/models/fieldSet.model';

@Component({
  selector: 'app-edit-birthday',
  templateUrl: './edit-birthday.component.html',
  styleUrls: ['./edit-birthday.component.scss']
})
export class EditBirthdayComponent extends EditController<CalendarBirthday> {
  public nameField!: FieldSet;
  public dayField!: FieldSet;
  public monthField!: FieldSet;
  public yearField!: FieldSet;

  protected override initComponents(): void {
    this.nameField = new DataField(CalendarBirthday.NAME);
    this.dayField = new DataField(CalendarBirthday.DAY);
    this.monthField = new DataField(CalendarBirthday.MONTH);
    this.yearField = new DataField(CalendarBirthday.YEAR);
  }
}
