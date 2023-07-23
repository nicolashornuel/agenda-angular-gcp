import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input() title: string | null | undefined;
  @Output() close = new EventEmitter<void>;

  public onClose(): void {
    this.close.emit();
  }
}
