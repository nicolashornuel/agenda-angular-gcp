import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { EventService } from 'src/app/agenda/services/event.service';
import { collapseAnimation } from 'src/app/core/models/collapse-animation';
import { CalEventDTO, CalEventType } from '../../models/calEvent.model';
import { AnnivDuJourService } from '../../services/annivDuJour.service';
import { SaintDuJourService } from '../../services/saintDuJour.service';

@Component({
  selector: 'app-cal-month-view-comment',
  templateUrl: './cal-month-view-comment.component.html',
  styleUrls: ['./cal-month-view-comment.component.scss'],
  animations: [collapseAnimation]
})
export class CalMonthViewCommentComponent implements OnChanges {

  @Input() viewDate!: Date;
  @Input() isOpen!: boolean;
  @Input() events!: CalendarEvent[];
  public comments: CalEventDTO[] = [];
  public saintDuJour?: string;
  public annivList?: string[] = [];

  constructor(
    private eventService: EventService,
    private saint: SaintDuJourService,
    private anniv: AnnivDuJourService,
    ) { }

  ngOnChanges(_changes: SimpleChanges): void {
    this.saintDuJour = this.saint.getWithDate(this.viewDate);
    this.annivList = this.anniv.getWithDate(this.viewDate);
    if (this.events) {
      this.comments = this.events.filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventType.COMMENT)
    }
  }

  public async onDelete(comment: CalEventDTO): Promise<void> {
    await this.eventService.delete(comment.id as string);
    console.log('delete ok');
  }

}
