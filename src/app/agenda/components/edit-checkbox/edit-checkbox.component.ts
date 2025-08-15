import { CalendarCheckbox, CalendarCheckboxRule, CalendarCheckboxRuleCondition } from '@agenda/models/agenda.model';
import { Component } from '@angular/core';
import { EditController } from '@shared/abstracts/abstract-editController.directive';
import { FieldSet, DataField, Nameable } from '@shared/models/fieldSet.model';
import { TableSet, ColumnCustom, CellRenderers, ActionSet } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-edit-checkbox',
  templateUrl: './edit-checkbox.component.html',
  styleUrls: ['./edit-checkbox.component.scss']
})
export class EditCheckboxComponent extends EditController<CalendarCheckbox> {
  public nameField!: FieldSet;
  public descriptionField!: FieldSet;
  public ruleTable!: TableSet;
  public orderField!: FieldSet;

  protected override initComponents(): void {
    this.nameField = new DataField(CalendarCheckbox.NAME);
    this.orderField = new DataField(CalendarCheckbox.ORDER);
    this.descriptionField = new DataField(CalendarCheckbox.DESCRIPTION);
    this.ruleTable = new TableSet('auto');
    this.ruleTable.verticaltextHeader = true;
    this.ruleTable.columnSet = [
      new ColumnCustom(
        CalendarCheckboxRule.CONDITION,
        true,
        CellRenderers.toInputSelect(CalendarCheckboxRuleCondition.CONDITIONS)
      ).setWidth('100%'),
      ...CalendarCheckboxRule.DAYS_OF_WEEK.map(
        (day: string, index: number) =>
          new ColumnCustom({ key: index, name: day } as Nameable, true, CellRenderers.toCheckBox())
      )
    ];
    this.ruleTable.actionSet = [new ActionSet(ActionSet.DELETE, (row, index) => this.delete(row, index!))];
    this.ruleTable.data = this.input.rules as CalendarCheckboxRule[];
  }

  public onAddRule() {
    this.ruleTable.data.push({ ...new CalendarCheckboxRule() });
  }

  private delete(row: CalendarCheckboxRule, index: number) {
    this.ruleTable.data.splice(index, 1);
  }
}
