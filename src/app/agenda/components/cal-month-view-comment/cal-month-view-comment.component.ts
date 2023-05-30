import { Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { EventService } from '@agenda/services/event.service';
import { collapseAnimation } from '@shared/models/collapse-animation.constant';
import { CalEventDTO, CalEventEntity, CalEventType } from '../../models/calEvent.model';
import { AnnivDuJour, AnnivDuJourService } from '../../services/annivDuJour.service';
import { SaintDuJourService } from '../../services/saintDuJour.service';
import { MapperService } from '../../services/mapper.service';
import { AlertService } from '@shared/services/alert.service';

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
  public comments: CalEventDTO[] = [];
  public saintDuJour?: string;
  public annivList?: AnnivDuJour[];
  public enableEditIndex: number | undefined | null = null;

  constructor(
    private eventService: EventService,
    private saint: SaintDuJourService,
    private anniv: AnnivDuJourService,
    private mapper: MapperService,
    private alert: AlertService
  ) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.saintDuJour = this.saint.getWithDate(this.viewDate);
    this.annivList = this.anniv.getWithDate(this.viewDate);
    if (this.events) {
      this.comments = this.events.filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventType.COMMENT);
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
