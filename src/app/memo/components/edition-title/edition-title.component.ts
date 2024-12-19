import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ModalService } from '@shared/services/shared.observable.service';
import { AbstractTitle } from 'app/memo/models/memo.model';

@Component({
  selector: 'app-edition-title',
  templateUrl: './edition-title.component.html',
  styleUrls: ['./edition-title.component.scss']
})
export class EditionTitleComponent {
  @Input() input!: AbstractTitle;
  @Output() output = new EventEmitter<AbstractTitle>();
  private modalService = inject(ModalService);

  public onClose(): void {
    this.modalService.set$(undefined);
  }

  public async onSave(): Promise<void> {
    this.output.emit(this.input);
    this.modalService.set$(undefined);
  }
}
