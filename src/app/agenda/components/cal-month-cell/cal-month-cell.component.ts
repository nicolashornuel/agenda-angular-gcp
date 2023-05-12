import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { EventService } from 'src/app/core/services/event.service';
import { DayClickedService } from '../../services/day-clicked.service';
import { take, takeUntil } from 'rxjs';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { AddExtraModalComponent } from '../add-extra-modal/add-extra-modal.component';

export interface EventField {
  title: string,
  id?: string,
  value?: boolean,
  display?: (day: CalendarMonthViewDay) => boolean,
  start: Timestamp | string,
  end?: Timestamp | string,
  type: 'recurrent' | 'comment',
  description: {
    true: string,
    false: string
  }
}

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
  @Output() dayClicked = new EventEmitter<any>();
  @ViewChild('modal', { read: ViewContainerRef }) target!: ViewContainerRef;

  public isActive: boolean = false;

  public emptyFields: EventField[] = [
    {
      title: 'JOUR',
      start: '07:00:00',
      end: '19:00:00',
      type: 'recurrent',
      display: (_day: CalendarMonthViewDay) => true,
      description: {
        true: "Emilie travaille aujourd'hui",
        false: "Emilie ne travaille pas aujourd'hui",
      }
    },
    {
      title: 'NUIT',
      start: '19:00:00',
      end: '23:59:59',
      type: 'recurrent',
      display: (_day: CalendarMonthViewDay) => true,
      description: {
        true: "Emilie travaille ce soir",
        false: "Emilie ne travaille pas ce soir",
      }
    },
    {
      title: 'Nounou',
      start: '8:00:00',
      end: '16:30:00',
      type: 'recurrent',
      display: (day: CalendarMonthViewDay) => !day.isWeekend,
      description: {
        true: "Romane va chez nounou aujourd'hui",
        false: "Romane ne va pas chez nounou aujourd'hui",
      }
    },
    {
      title: 'GM',
      start: '07:30:00',
      end: '09:00:00',
      type: 'recurrent',
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday',
      description: {
        true: "Baptiste va à la garderie ce matin",
        false: "Baptiste ne va pas à la garderie ce matin",
      }
    },
    {
      title: 'Cantine',
      start: '12:00:00',
      end: '14:00:00',
      type: 'recurrent',
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday',
      description: {
        true: "Baptiste mange à la cantine aujourd'hui",
        false: "Baptiste ne mange pas à la cantine aujourd'hui",
      }
    },
    {
      title: 'GS',
      start: '17:00:00',
      end: '19:00:00',
      type: 'recurrent',
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday',
      description: {
        true: "Baptiste va à la garderie ce soir",
        false: "Baptiste ne va pas à la garderie ce soir",
      }
    },
    {
      title: 'CLSH',
      start: '07:30:00',
      end: '18:30:00',
      type: 'recurrent',
      display: (day: CalendarMonthViewDay) => day.day == 3 || (!day.isWeekend && day.cssClass == 'holiday'),
      description: {
        true: "Baptiste va au centre de loisir aujourd'hui",
        false: "Baptiste ne va pas au centre de loisir aujourd'hui",
      }
    }
  ]
  public formFields: EventField[] = [];

  public comments: EventField[] = [];

  constructor(
    private eventService: EventService,
    private dayService: DayClickedService,
    private destroy$: DestroyService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (isSameMonth(new Date(), this.viewDate) && isSameDay(this.day.date, this.viewDate)) this.isActive = true;
  }

  /**
   * initialize field : display or not & checked or not
   *
   * @private
   * @memberof CalMonthCellComponent
   */
  private initializeData(): void {
    this.emptyFields.forEach((field: EventField) => {
      let existField: CalendarEvent | undefined = this.day.events.find((dayEvent: CalendarEvent) => dayEvent.title === field.title);
      this.comments = this.day.events.map((dayEvent: CalendarEvent) =>  ({ ...dayEvent }) as unknown as EventField).filter( (eventField: EventField) => eventField.type === 'comment' );
      let formField: EventField = existField != undefined ? { id: existField.id as string, value: true, ...field } : { value: false, ...field };
      if (field.display && field.display(this.day)) this.formFields.push(formField);
    });
    this.dayService.getDayClicked$.pipe(takeUntil(this.destroy$)).subscribe((date: Date) => {
      this.isActive = isSameDay(this.day.date, date) ? true : false;
    })
  }

  /**
   * onCLick checkbox to save or delete 
   *
   * @param {*} formField
   * @memberof CalMonthCellComponent
   */
  public onCheck(formField: EventField) {
    if (!formField.value) {
      this.eventService.delete(formField.id as string).then(() => {
        console.log('delete ok');
      });
    } else if (formField.value) {
      this.eventService.save(this.mapper(formField)).then((id) => {
        formField.id = id;
        console.log('save ok');
      });
    }
  }

  /**
   * mapping formField to save EventField
   *
   * @private
   * @param {EventField} field
   * @return {*}  {EventField}
   * @memberof CalMonthCellComponent
   */
  private mapper(field: EventField): EventField {
    return {
      title: field.title,
      type: field.type,
      description: field.description,
      start: Timestamp.fromDate(new Date(this.day.date.toDateString() + ' ' + field.start)),
      end: field.end ? Timestamp.fromDate(new Date(this.day.date.toDateString() + ' ' + field.end)) : undefined,
    }
  }

  /**
   * onclick to view extra events inside 'activeDayIsOpen' & Month view
   *
   * @memberof CalMonthCellComponent
   */
  public viewExtra(): void {
    this.isActive
      ? this.dayService.setDayClicked$(null)
      : this.dayService.setDayClicked$(this.day.date);
  }

  /**
   * button to open modal add comment
   *
   * @memberof CalMonthCellComponent
   */
  public addExtra(): void {
    const modal = this.modalService.openModal(this.target, AddExtraModalComponent, this.day);
    modal.listenEvent().pipe(take(1)).subscribe((response: string) => {
      if (response) console.log(response);
    });
  }

  /**
   * allow to block viewExtra inside cell-day over month
   *
   * @return {*}  {boolean}
   * @memberof CalMonthCellComponent
   */
  public isSameMonth(): boolean {
    return isSameMonth(this.day.date, this.viewDate);
  }

}
