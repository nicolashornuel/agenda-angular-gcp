import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarMonthViewDay } from 'angular-calendar';
import { CalendarEventType, CalEventTypeEnum } from '../../models/calEvent.model';
import { ModalService } from '@shared/services/shared.observable.service';

@Component({
  selector: 'app-cal-month-add-comment',
  templateUrl: './cal-month-add-comment.component.html',
  styleUrls: ['./cal-month-add-comment.component.scss']
})
export class CalMonthAddCommentComponent implements OnInit {
  @Input() input!: CalendarMonthViewDay;
  @Output() output = new EventEmitter<string>();
  public events: string[] = [];

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.events = this.input.events
    .filter((event: CalendarEventType) => event.meta!.type === CalEventTypeEnum.FAMILY)
    .map((event: CalendarEventType) => event.title)
  }

  public onClose(): void {
    this.modalService.set$(undefined);
  }

  public onSave(value: string): void {
    this.output.emit(value);
    this.modalService.set$(undefined);
  }
}
