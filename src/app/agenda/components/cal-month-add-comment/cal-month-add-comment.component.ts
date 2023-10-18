import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarMonthViewDay } from 'angular-calendar';
import { ModalService } from '@shared/services/modal.service';
import { CalEventDTO, CalEventType } from '../../../../../models/calEvent.model';

@Component({
  selector: 'app-cal-month-add-comment',
  templateUrl: './cal-month-add-comment.component.html',
  styleUrls: ['./cal-month-add-comment.component.scss']
})
export class CalMonthAddCommentComponent implements OnInit {
  @Input() data!: CalendarMonthViewDay;
  @Output() response = new EventEmitter<string>();
  public events: string[] = [];

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.events = this.data.events
    .filter((event: CalEventDTO) => event.meta!.type === CalEventType.FAMILY)
    .map((event: CalEventDTO) => event.title)
  }

  public onClose(): void {
    this.modalService.closeModal();
  }

  public onSave(value: string): void {
    this.response.emit(value);
  }
}
