import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-extra-modal',
  templateUrl: './add-extra-modal.component.html',
  styleUrls: ['./add-extra-modal.component.scss']
})
export class AddExtraModalComponent {
  @Input() data?: any;
  @Output() response = new EventEmitter<any>();
}
