import { Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { collapseAnimation } from '@shared/models/triggerAnimation.constant';
import { AlertService } from '@shared/services/alert.service';
import { CalendarEvent } from 'angular-calendar';
import { CalBirthday, CalEventDTO, CalEventEntity, CalEventTypeEnum } from '../../models/calEvent.model';
import { MapperService } from '../../services/mapper.service';
import { SaintDuJourService } from '../../services/saintDuJour.service';
import { CalEventService } from '@agenda/services/agenda.firestore.service';

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
  @Input() birthdays!: CalBirthday[];
  @ViewChild('modal', {read: ViewContainerRef}) target!: ViewContainerRef;
  public comments: CalEventDTO[] = [];
  public saintDuJour?: string;
  public annivDuJour?: CalBirthday[];
  public enableEditIndex: number | undefined | null = null;

  constructor(
    private eventService: CalEventService,
    private saint: SaintDuJourService,
    private mapper: MapperService,
    private alert: AlertService
  ) {}

  async ngOnChanges(_changes: SimpleChanges): Promise<void> {
    this.saintDuJour = await this.saint.getWithDate(this.viewDate);
    this.annivDuJour = this.birthdays.filter(birthday => birthday.day === this.viewDate.getDate());
    if (this.events) {
      this.comments = this.events.filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventTypeEnum.COMMENT);
    }
  }

  public async onDelete(comment: CalEventDTO): Promise<void> {
    await this.eventService.delete(comment.id as string);
    this.alert.success('delete ok')
  }

  public onEdit(rowIndex: number): void {
    this.enableEditIndex = rowIndex;
  }

  public async onUpdate(comment: CalEventDTO): Promise<void> {
    this.disableEditMethod();
    const entity: CalEventEntity = this.mapper.commentToEntity(comment.title, comment.start);
    await this.eventService.update(entity, comment.id as string);
    this.alert.success('update ok')
  }

  public onCancel(): void {
    this.disableEditMethod();
  }

  private disableEditMethod(): void {
    this.enableEditIndex = null;
  }
}
