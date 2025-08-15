import {
  CalendarCheckbox,
  CalendarEventType,
  CalendarTypeEnum,
  CalendarCheckboxRuleCondition
} from '@agenda/models/agenda.model';
import { CalendarConfirmedService } from '@agenda/services/agenda.firestore.service';
import { DayClickedService } from '@agenda/services/agenda.observable.service';
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
  @Input() calendarCheckboxList!: CalendarCheckbox[];
  @ViewChild('modal', { read: ViewContainerRef }) target!: ViewContainerRef;
  public isActive: boolean = false;
  public formFields: any[] = [];
  public comments: CalendarEventType[] = [];

  @HostBinding('class') get additionalClass() {
    return `f-grow col-start-stretch ${this.day.cssClass}`;
  }

  constructor(
    private calendarEventService: CalendarConfirmedService,
    private dayService: DayClickedService,
    private destroy$: DestroyService,
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
      .filter((eventField: CalendarEventType) => eventField.meta!.type === CalendarTypeEnum.COMMENT);
  }

  private initializeData(): void {
    this.calendarCheckboxList.forEach(calendarCheckbox => {
      const existField = this.day.events
        .filter((eventField: CalendarEventType) => eventField.meta!.type === CalendarTypeEnum.FAMILY)
        .find((dayEvent: CalendarEvent) => dayEvent.meta!.checkboxId === calendarCheckbox.id);

      if (this.isReadyRule(calendarCheckbox.rules as Record<string, boolean[]>))
        this.formFields.push({
          ...existField,
          value: existField ? true : false,
          calendarCheckbox,
          type: CalendarTypeEnum.FAMILY
        });
    });

    this.dayService.get$.pipe(takeUntil(this.destroy$)).subscribe(date => {
      this.isActive = date && isSameDay(this.day.date, date) ? true : false;
    });
  }

  private isReadyRule(rules: Record<string, boolean[]>): boolean {
    return (
      (this.day.cssClass === 'holiday' &&
        rules[CalendarCheckboxRuleCondition.HOLIDAY.key] &&
        rules[CalendarCheckboxRuleCondition.HOLIDAY.key][this.day.day]) ||
      (this.day.cssClass === 'public-holiday' &&
        rules[CalendarCheckboxRuleCondition.PUBLIC_HOLIDAY.key] &&
        rules[CalendarCheckboxRuleCondition.PUBLIC_HOLIDAY.key][this.day.day]) ||
      (this.day.cssClass !== 'public-holiday' &&
        this.day.cssClass !== 'holiday' &&
        rules[CalendarCheckboxRuleCondition.NOT_HOLIDAY.key] &&
        rules[CalendarCheckboxRuleCondition.NOT_HOLIDAY.key][this.day.day]) ||
      (rules[CalendarCheckboxRuleCondition.DEFAULT.key] &&
        rules[CalendarCheckboxRuleCondition.DEFAULT.key][this.day.day])
    );
  }

  public onCheckChange(calendarEvent: any): void {
    !calendarEvent.value && calendarEvent.id
      ? this.calendarEventService.delete(calendarEvent.id).then(() => {
          this.alert.success('delete ok');
        })
      : this.calendarEventService.confirmCheckbox(calendarEvent.calendarCheckbox.id, this.day.date).then(id => {
          calendarEvent.id = id;
          this.alert.success('save ok');
        });
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
/*     if (comment) {
      const entity = this.mapper.commentToEntity(comment, this.day.date);
      await this.eventService.save(entity);
      this.alert.success('save ok');
    } */
  }
}
