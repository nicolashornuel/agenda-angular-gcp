import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { EventService } from 'src/app/agenda/services/event.service';
import { collapseAnimation } from 'src/app/core/models/collapse-animation';
import { CalEventDTO, CalEventType } from '../../models/calEvent.model';
import { SaintDuJourService } from '../../services/saintDuJour.service';

@Component({
  selector: 'app-cal-month-view-comment',
  templateUrl: './cal-month-view-comment.component.html',
  styleUrls: ['./cal-month-view-comment.component.scss'],
  animations: [collapseAnimation]
})
export class CalMonthViewCommentComponent implements OnInit, OnChanges {

  @Input() viewDate!: Date;
  @Input() isOpen!: boolean;
  @Input() events!: CalendarEvent[];
  public comments: CalEventDTO[] = [];
  public saintDuJour?: string;

  constructor(private eventService: EventService, private saint: SaintDuJourService) { }

  ngOnInit(): void {
    
    //this.saintDuJour.getEphemerisName()
  }

  ngOnChanges(changes: SimpleChanges): void {
/*     if (!changes['events'].firstChange) {
      this.saintDuJour = this.saint.getWithDate(this.viewDate);
    } */
    this.saintDuJour = this.saint.getWithDate(this.viewDate);

    if (this.events) {
      this.comments = this.events.filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventType.COMMENT)
    }
  }

  public async onDelete(comment: CalEventDTO): Promise<void> {
    await this.eventService.delete(comment.id as string);
    console.log('delete ok');
  }


}
