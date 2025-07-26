import { CalRecurringEventRule, CalRecurringEventRuleCondition, CalRecurringEventType } from '@agenda/models/calEvent.model';
import { Component } from '@angular/core';
import { EditController } from '@shared/abstracts/abstract-editController.directive';
import { DataField, FieldSet, Nameable } from '@shared/models/fieldSet.model';
import { ActionSet, CellRenderers, ColumnCustom, TableSet } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-edit-recurring-event-type',
  templateUrl: './edit-recurring-event-type.component.html',
  styleUrls: ['./edit-recurring-event-type.component.scss']
})
export class EditRecurringEventTypeComponent extends EditController<CalRecurringEventType> {
  public nameField!: FieldSet;
  public startAtField!: FieldSet;
  public endAtField!: FieldSet;
  public descriptionField!: FieldSet;
  public ruleTable!: TableSet;

  protected override initComponents(): void {
    this.nameField = new DataField(CalRecurringEventType.NAME);
    this.startAtField = new DataField(CalRecurringEventType.START_AT);
    this.endAtField = new DataField(CalRecurringEventType.END_AT);
    this.descriptionField = new DataField(CalRecurringEventType.DESCRIPTION);
    this.ruleTable = new TableSet('auto');
    this.ruleTable.verticaltextHeader = true;
    this.ruleTable.columnSet = [
      new ColumnCustom(
        CalRecurringEventRule.CONDITION,
        true,
        CellRenderers.toInputSelect(CalRecurringEventRuleCondition.CONDITIONS)
      ).setWidth('100%'),
      ...CalRecurringEventRule.DAYS_OF_WEEK.map(
        (day: string, index: number) =>
          new ColumnCustom({ key: index, name: day } as Nameable, true, CellRenderers.toCheckBox())
      )
    ];
    this.ruleTable.actionSet = [new ActionSet(ActionSet.DELETE, (row, index) => this.delete(row, index!))];
    this.ruleTable.data = this.input.rules as CalRecurringEventRule[];
  }

  public onAddRule() {
    this.ruleTable.data.push({ ...new CalRecurringEventRule() });
  }

  private delete(row: CalRecurringEventRule, index: number) {
    this.ruleTable.data.splice(index, 1);
  }
}
