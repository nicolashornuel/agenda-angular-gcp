import {
  CalendarCheckboxEvent,
  CalRecurringEventRule,
  CalRecurringEventRuleCondition,
  CalRecurringEventType
} from '@agenda/models/calEvent.model';
import { Component } from '@angular/core';
import { EditController } from '@shared/abstracts/abstract-editController.directive';
import { FieldSet, DataField, Nameable } from '@shared/models/fieldSet.model';
import { TableSet, ColumnCustom, CellRenderers, ActionSet } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-edit-checkbox-event',
  templateUrl: './edit-checkbox-event.component.html',
  styleUrls: ['./edit-checkbox-event.component.scss']
})
export class EditCheckboxEventComponent extends EditController<CalendarCheckboxEvent> {
  public nameField!: FieldSet;
  public descriptionField!: FieldSet;
  public ruleTable!: TableSet;
  public orderField!: FieldSet;

  protected override initComponents(): void {
    this.nameField = new DataField(CalendarCheckboxEvent.NAME);
    this.orderField = new DataField(CalendarCheckboxEvent.ORDER);
    this.descriptionField = new DataField(CalendarCheckboxEvent.DESCRIPTION);
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
