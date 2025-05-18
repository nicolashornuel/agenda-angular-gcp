import { EventService } from '@agenda/services/event.service';
import { DatePipe } from '@angular/common';
import {
  Component,
  Host,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { AlertService } from '@shared/services/alert.service';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/shared.observable.service';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { takeUntil } from 'rxjs';
import { CalEventDTO, CalEventField, CalEventType } from '../../models/calEvent.model';
import { emptyFields } from '../../models/emptyFields.constant';
import { DayClickedService } from '../../services/day-clicked.service';
import { MapperService } from '../../services/mapper.service';

@Component({
  selector: 'app-cal-month-cell',
  templateUrl: './cal-month-cell.component.html',
  styleUrls: ['./cal-month-cell.component.scss']
})
export class CalMonthCellComponent implements OnInit, OnChanges {
  @Input() day!: CalendarMonthViewDay;
  @Input() locale!: string;
  @Input() isLocked!: boolean;
  @Input() viewDate!: Date;
  @ViewChild('modal', { read: ViewContainerRef }) target!: ViewContainerRef;
  public isActive: boolean = false;
  public formFields: CalEventField[] = [];
  public comments: CalEventDTO[] = [];

  @HostBinding('class') get additionalClass() {
    return `f-grow col-start-stretch ${this.day.cssClass}`;
  }

  constructor(
    private eventService: EventService,
    private dayService: DayClickedService,
    private destroy$: DestroyService,
    private mapper: MapperService,
    public alert: AlertService,
    private modalService: ModalService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (isSameMonth(new Date(), this.viewDate) && isSameDay(this.day.date, this.viewDate)) this.isActive = true;
    this.comments = this.day.events
      .map((dayEvent: CalendarEvent) => ({ ...dayEvent }))
      .filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventType.COMMENT);
  }

  private initializeData(): void {
    emptyFields.forEach((field: CalEventField) => {
      let existField: CalendarEvent | undefined = this.day.events
        .filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventType.FAMILY)
        .find((dayEvent: CalendarEvent) => dayEvent.title === field.title);

      let formField: CalEventField =
        existField != undefined
          ? { ...field, id: existField.id as string, meta: { ...field.meta, value: true } }
          : { ...field, meta: { ...field.meta, value: false } };

      if (this.day.cssClass === 'holiday' && field.meta?.daysWhenHoliday?.includes(this.day.day)) {
        this.formFields.push(formField);
      } else if (this.day.cssClass === 'public-holiday' && field.meta?.daysWhenPublicHoliday?.includes(this.day.day)) {
        this.formFields.push(formField);
      } else if (this.day.cssClass !== 'public-holiday' && this.day.cssClass !== 'holiday' && field.meta?.daysWhenNotHoliday?.includes(this.day.day)) {
        this.formFields.push(formField);
      }

    });
    this.dayService.get$.pipe(takeUntil(this.destroy$)).subscribe(date => {
      this.isActive = date && isSameDay(this.day.date, date) ? true : false;
    });
  }

  public onCheckChange(value: boolean, formField: CalEventField): void {
    formField.meta!.value = value;
    if (!formField.meta!.value) {
      this.eventService.delete(formField.id as string).then(() => {
        this.alert.success('delete ok');
      });
    } else if (formField.meta!.value) {
      const entity = this.mapper.fieldToEntity(formField, this.day.date);
      this.eventService.save(entity).then(id => {
        formField.id = id;
        this.alert.success('save ok');
      });
    }
  }

  public onDisplayComment(): void {
    this.dayService.set$(this.isActive ? null : this.day.date);
  }

  public onOpenModal(templateRef: TemplateRef<Modal>): void {
    const modalParam: ModalParam<CalendarMonthViewDay> = {
      title: this.datePipe.transform(this.day.date, 'fullDate')!,
      context: { $implicit: this.day },
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }

  public async onAddComment(comment: string): Promise<void> {
    if (comment) {
      const entity = this.mapper.commentToEntity(comment, this.day.date);
      await this.eventService.save(entity);
      this.alert.success('save ok');
    }
  }
}
