import {
  CalCheckboxEvent,
  CalendarCheckboxEvent,
  CalEventDTO,
  CalEventTypeEnum,
  CalRecurringEvent,
  CalRecurringEventRuleCondition
} from '@agenda/models/calEvent.model';
import { CalEventService } from '@agenda/services/agenda.firestore.service';
import { DayClickedService } from '@agenda/services/agenda.observable.service';
import { MapperService } from '@agenda/services/mapper.service';
import { DatePipe } from '@angular/common';
import {
  Component,
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
  @Input() calRecurringEvents!: CalendarCheckboxEvent[];
  @ViewChild('modal', { read: ViewContainerRef }) target!: ViewContainerRef;
  public isActive: boolean = false;
  public formFields: CalendarCheckboxEvent[] = [];
  public comments: CalEventDTO[] = [];

  @HostBinding('class') get additionalClass() {
    return `f-grow col-start-stretch ${this.day.cssClass}`;
  }

  constructor(
    private eventService: CalEventService,
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
      .filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventTypeEnum.COMMENT);
  }

  private initializeData(): void {
    this.calRecurringEvents.forEach(calendarCheckboxEvent => {
      const existField = this.day.events
        .filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventTypeEnum.FAMILY)
        .find((dayEvent: CalendarEvent) => dayEvent.title === calendarCheckboxEvent.name);
        
      const item = {
        ...calendarCheckboxEvent,
        meta: {...calendarCheckboxEvent},
        value: existField ? true : false,
        id: existField?.id as string
      };
      if (this.isReadyRule(calendarCheckboxEvent.rules as Record<string, boolean[]>)) this.formFields.push(item);
    });
    this.dayService.get$.pipe(takeUntil(this.destroy$)).subscribe(date => {
      this.isActive = date && isSameDay(this.day.date, date) ? true : false;
    });
  }
  /*   private initializeData(): void {
    this.calRecurringEvents.forEach(calRecurringEvent => {
      const checkboxEvent = new CalCheckboxEvent(calRecurringEvent);
      if (this.isReadyRule(checkboxEvent.meta!.rules)) this.formFields.push(checkboxEvent);

      const existField = this.day.events
        .filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventTypeEnum.FAMILY)
        .find((dayEvent: CalendarEvent) => dayEvent.title === checkboxEvent.title);

      if (existField) checkboxEvent.id = existField.id;
      checkboxEvent.meta!.value = existField ? true : false;
    });

    this.dayService.get$.pipe(takeUntil(this.destroy$)).subscribe(date => {
      this.isActive = date && isSameDay(this.day.date, date) ? true : false;
    });
  } */

  private isReadyRule(rules: Record<string, boolean[]>): boolean {
    return (
      (this.day.cssClass === 'holiday' &&
        rules[CalRecurringEventRuleCondition.HOLIDAY.key] &&
        rules[CalRecurringEventRuleCondition.HOLIDAY.key][this.day.day]) ||
      (this.day.cssClass === 'public-holiday' &&
        rules[CalRecurringEventRuleCondition.PUBLIC_HOLIDAY.key] &&
        rules[CalRecurringEventRuleCondition.PUBLIC_HOLIDAY.key][this.day.day]) ||
      (this.day.cssClass !== 'public-holiday' &&
        this.day.cssClass !== 'holiday' &&
        rules[CalRecurringEventRuleCondition.NOT_HOLIDAY.key] &&
        rules[CalRecurringEventRuleCondition.NOT_HOLIDAY.key][this.day.day]) ||
      (rules[CalRecurringEventRuleCondition.DEFAULT.key] &&
        rules[CalRecurringEventRuleCondition.DEFAULT.key][this.day.day])
    );
  }

  public onCheckChange(calCheckboxEvent: CalendarCheckboxEvent): void {
    console.log(calCheckboxEvent);
    
    /*   !calCheckboxEvent.value && calCheckboxEvent.id
      ? this.eventService.delete(calCheckboxEvent.id as string).then(() => {
          this.alert.success('delete ok');
        })
      : this.eventService.add(calCheckboxEvent, this.day.date).then(() => {
          this.alert.success('save ok');
        }); */
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
