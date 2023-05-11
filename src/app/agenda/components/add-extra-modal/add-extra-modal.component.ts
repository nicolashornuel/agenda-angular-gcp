import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-add-extra-modal',
  templateUrl: './add-extra-modal.component.html',
  styleUrls: ['./add-extra-modal.component.scss']
})
export class AddExtraModalComponent {
  @Input() data?: any;
  @Output() response = new EventEmitter<any>();

  constructor(private modalService: ModalService) { }

  public onClose(): void {
    this.modalService.closeModal();
  }

  public onSave(value: string): void {
    this.response.emit(value);
  }
}
