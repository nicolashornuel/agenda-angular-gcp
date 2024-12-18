import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ModalService } from '@shared/services/shared.observable.service';
import { AbstractField } from 'app/memo/service/memo.service';

@Component({
  selector: 'app-edition-field',
  templateUrl: './edition-field.component.html',
  styleUrls: ['./edition-field.component.scss']
})
export class EditionFieldComponent {

  @Input() input!: AbstractField;
  @Output() output = new EventEmitter<AbstractField>();
  private modalService = inject(ModalService);
  public type = {
    name: "Type de donnée",
    options: Object.values(AbstractField)
  }

  public onClose(): void {
    this.modalService.set$(undefined);
  }

  public async onSave(): Promise<void> {
    this.output.emit(this.input);
    this.modalService.set$(undefined);
  }

  public onSelectChange(): void {
    if (this.input) this.input.value = null;
  }
}
