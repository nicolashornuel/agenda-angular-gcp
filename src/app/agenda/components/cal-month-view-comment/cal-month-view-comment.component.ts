import {EventService} from '@agenda/services/event.service';
import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {collapseAnimation} from '@shared/models/triggerAnimation.constant';
import {AlertService} from '@shared/services/alert.service';
import {CalendarEvent} from 'angular-calendar';
import {CalEventType} from '../../models/calEvent.model';
import {AnnivDuJour, AnnivDuJourService} from '../../services/annivDuJour.service';
import {SaintDuJourService} from '../../services/saintDuJour.service';
import {take} from 'rxjs';

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
  @Input() isLocked!: boolean;
  @ViewChild('modal', {read: ViewContainerRef}) target!: ViewContainerRef;
  public comments: CalendarEvent[] = [];
  public saintDuJour?: string;
  public annivList?: AnnivDuJour[];
  public enableEditIndex: number | undefined | null = null;

  constructor(
    private eventService: EventService,
    private saint: SaintDuJourService,
    private anniv: AnnivDuJourService,
    private alert: AlertService
  ) {}

  async ngOnChanges(_changes: SimpleChanges): Promise<void> {
    this.saintDuJour = await this.saint.getWithDate(this.viewDate);
    this.annivList = this.anniv.getWithDate(this.viewDate);
    if (this.events) {
      this.comments = this.events.filter((eventField: CalendarEvent) => eventField.meta!.type === CalEventType.COMMENT);
    }
  }

  public onDelete(comment: CalendarEvent): void {
    this.eventService.delete(comment.id as string).pipe(take(1)).subscribe(() => this.alert.success('delete ok'));
  }

  public onEdit(rowIndex: number): void {
    this.enableEditIndex = rowIndex;
  }

  public onUpdate(comment: CalendarEvent): void {
    this.disableEditMethod();
    const calendarEvent: CalendarEvent = this.eventService.commentToEntity(comment.title, comment.start);
    this.eventService
      .update(calendarEvent)
      .pipe(take(1))
      .subscribe(() => this.alert.success('update ok'));
  }

  public onCancel(): void {
    this.disableEditMethod();
  }

  private disableEditMethod(): void {
    this.enableEditIndex = null;
  }
}
