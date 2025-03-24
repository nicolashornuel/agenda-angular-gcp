import { Directive, EventEmitter, inject, Input, Output } from '@angular/core';
import { ModalService } from '@shared/services/shared.observable.service';

@Directive({
  selector: '[]'
})
export class AbstractModal<T> {

  @Input() input!: T;
  @Output() output = new EventEmitter<T>();
  
  private modalService = inject(ModalService);

  public onClose() {
    this.modalService.set$(undefined);
  }

  public onSave() {
    this.output.emit(this.input);
    this.modalService.set$(undefined);
  }

}
