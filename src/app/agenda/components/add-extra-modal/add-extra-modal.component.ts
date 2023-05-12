import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { EventField } from '../cal-month-cell/cal-month-cell.component';

@Component({
  selector: 'app-add-extra-modal',
  templateUrl: './add-extra-modal.component.html',
  styleUrls: ['./add-extra-modal.component.scss']
})
export class AddExtraModalComponent implements OnInit {
  @Input() data!: any;
  @Output() response = new EventEmitter<any>();
  public events: string[] = [];

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.events = this.data.events
    .filter((event: EventField) => event.type === 'recurrent')
    .map((event: EventField) => event.title)
  }

  public onClose(): void {
    this.modalService.closeModal();
  }

  public onSave(value: string): void {
    this.response.emit(value);
  }
}
