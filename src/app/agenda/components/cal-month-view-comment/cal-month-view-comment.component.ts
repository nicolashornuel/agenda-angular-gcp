import { CalendarConfirmedService } from '@agenda/services/agenda.firestore.service';
import { Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { collapseAnimation } from '@shared/models/triggerAnimation.constant';
import { AlertService } from '@shared/services/alert.service';
import { CalendarEvent } from 'angular-calendar';
import { CalendarBirthday, CalendarEventType, CalEventTypeEnum } from '../../models/calEvent.model';
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
  @Input() isLocked!: boolean;
  @Input() birthdays!: CalendarBirthday[];
  @ViewChild('modal', {read: ViewContainerRef}) target!: ViewContainerRef;
  public comments: CalendarEventType[] = [];
  public saintDuJour?: string;
  public annivDuJour?: CalendarBirthday[];
  public enableEditIndex: number | undefined | null = null;

  constructor(
    private eventService: CalendarConfirmedService,
    private saint: SaintDuJourService,
    private alert: AlertService
  ) {}

  async ngOnChanges(_changes: SimpleChanges): Promise<void> {
    this.saintDuJour = await this.saint.getWithDate(this.viewDate);
    this.annivDuJour = this.birthdays.filter(birthday => birthday.day === this.viewDate.getDate());
    if (this.events) {
      this.comments = this.events.filter((eventField: CalendarEventType) => eventField.meta!.type === CalEventTypeEnum.COMMENT);
    }
  }

  public async onDelete(comment: CalendarEventType): Promise<void> {
    await this.eventService.delete(comment.id as string);
    this.alert.success('delete ok')
  }

  public onEdit(rowIndex: number): void {
    this.enableEditIndex = rowIndex;
  }

  public async onUpdate(comment: CalendarEventType): Promise<void> {
    this.disableEditMethod();
    await this.eventService.saveLikeComment(comment);
    this.alert.success('update ok')
  }

  public onCancel(): void {
    this.disableEditMethod();
  }

  private disableEditMethod(): void {
    this.enableEditIndex = null;
  }
}
