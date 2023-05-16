import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CalendarEvent, CalendarMonthViewDay} from 'angular-calendar';
import {isSameDay, isSameMonth} from 'date-fns';
import {take, takeUntil} from 'rxjs';
import {EventService} from 'src/app/agenda/services/event.service';
import {DestroyService} from 'src/app/shared/services/destroy.service';
import {ModalService} from 'src/app/shared/services/modal.service';
import {CalEventDTO, CalEventField, CalEventType} from '../../models/calEvent.model';
import {DayClickedService} from '../../services/day-clicked.service';
import {MapperService} from '../../services/mapper.service';
import {CalMonthAddCommentComponent} from '../cal-month-add-comment/cal-month-add-comment.component';
import {emptyFields} from '../../models/emptyFields.constant';

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
  @ViewChild('modal', {read: ViewContainerRef}) target!: ViewContainerRef;
  public isActive: boolean = false;
  public formFields: CalEventField[] = [];
  public comments: CalEventDTO[] = [];

  constructor(
    private eventService: EventService,
    private dayService: DayClickedService,
    private destroy$: DestroyService,
    private modalService: ModalService,
    private mapper: MapperService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (isSameMonth(new Date(), this.viewDate) && isSameDay(this.day.date, this.viewDate)) this.isActive = true;
    this.comments = this.day.events
      .map((dayEvent: CalendarEvent) => ({...dayEvent}))
      .filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventType.COMMENT);
  }

  /**
   * initialize field : display or not & checked or not
   *
   * @private
   * @memberof CalMonthCellComponent
   */
  private initializeData(): void {
    emptyFields.forEach((field: CalEventField) => {
      let existField: CalendarEvent | undefined = this.day.events
        .filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventType.FAMILY)
        .find((dayEvent: CalendarEvent) => dayEvent.title === field.title);

      let formField: CalEventField =
        existField != undefined
          ? {...field, id: existField.id as string, meta: {...field.meta, value: true}}
          : {...field, meta: {...field.meta, value: false}};

      if (field.meta && field.meta.display && field.meta.display(this.day)) this.formFields.push(formField);
    });

    this.dayService.getDayClicked$.pipe(takeUntil(this.destroy$)).subscribe((date: Date) => {
      this.isActive = isSameDay(this.day.date, date) ? true : false;
    });
  }

  /**
   * onCLick checkbox to save or delete
   *
   * @param {*} formField
   * @memberof CalMonthCellComponent
   */
  public onCheck(formField: CalEventField) {
    if (!formField.meta!.value) {
      this.eventService.delete(formField.id as string).then(() => {
        console.log('delete ok');
      });
    } else if (formField.meta!.value) {
      const entity = this.mapper.fieldToEntity(formField, this.day.date);
      this.eventService.save(entity).then(id => {
        formField.id = id;
        console.log('save ok');
      });
    }
  }

  /**
   * onclick to view extra events inside 'activeDayIsOpen' & Month view
   *
   * @memberof CalMonthCellComponent
   */
  public viewExtra(): void {
    this.isActive ? this.dayService.setDayClicked$(null) : this.dayService.setDayClicked$(this.day.date);
  }

  /**
   * button to open modal add comment
   *
   * @memberof CalMonthCellComponent
   */
  public addExtra(): void {
    const modal = this.modalService.openModal(this.target, CalMonthAddCommentComponent, this.day);
    modal
      .listenEvent()
      .pipe(take(1))
      .subscribe(async (response: string) => {
        if (response) {
          const entity = this.mapper.commentToEntity(response, this.day.date);
          await this.eventService.save(entity);
          console.log('save ok');
        }
      });
  }

}
