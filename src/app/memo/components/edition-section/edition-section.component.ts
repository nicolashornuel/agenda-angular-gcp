import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ModalService } from '@shared/services/shared.observable.service';
import { AbstractSection } from 'app/memo/service/memo.service';

@Component({
  selector: 'app-edition-section',
  templateUrl: './edition-section.component.html',
  styleUrls: ['./edition-section.component.scss']
})
export class EditionSectionComponent {
  @Input() input!: AbstractSection;
  @Output() output = new EventEmitter<AbstractSection>();
  private modalService = inject(ModalService);

  public onClose(): void {
    this.modalService.set$(undefined);
  }

  public async onSave(): Promise<void> {
    this.output.emit(this.input);
    this.modalService.set$(undefined);
  }
}
