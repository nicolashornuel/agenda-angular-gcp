import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { take, takeUntil } from 'rxjs';
import { EventService } from 'src/app/agenda/services/event.service';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CalEventDTO, CalEventField, CalEventType } from '../../models/cal-event.models';
import { DayClickedService } from '../../services/day-clicked.service';
import { MapperService } from '../../services/mapper.service';
import { CalMonthAddCommentComponent } from '../cal-month-add-comment/cal-month-add-comment.component';

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

  public emptyFields: CalEventField[] = [
    {
      title: 'JOUR',
      meta: {
        start: '07:00:00',
        end: '19:00:00',
        type: CalEventType.FAMILY,
        display: (_day: CalendarMonthViewDay) => true,
        description: {
          true: "Emilie travaille aujourd'hui",
          false: "Emilie ne travaille pas aujourd'hui",
        }
      }

    },
    {
      title: 'NUIT',
      meta: {
        start: '19:00:00',
        end: '23:59:59',
        type: CalEventType.FAMILY,
        display: (_day: CalendarMonthViewDay) => true,
        description: {
          true: "Emilie travaille ce soir",
          false: "Emilie ne travaille pas ce soir",
        }
      }
    },
    {
      title: 'Nounou',
      meta: {
        start: '8:00:00',
        end: '16:30:00',
        type: CalEventType.FAMILY,
        display: (day: CalendarMonthViewDay) => !day.isWeekend,
        description: {
          true: "Romane va chez nounou aujourd'hui",
          false: "Romane ne va pas chez nounou aujourd'hui",
        }
      }
    },
    {
      title: 'GM',
      meta: {
        start: '07:30:00',
        end: '09:00:00',
        type: CalEventType.FAMILY,
        display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday',
        description: {
          true: "Baptiste va à la garderie ce matin",
          false: "Baptiste ne va pas à la garderie ce matin",
        }
      }
    },
    {
      title: 'Cantine',
      meta: {
        start: '12:00:00',
        end: '14:00:00',
        type: CalEventType.FAMILY,
        display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday',
        description: {
          true: "Baptiste mange à la cantine aujourd'hui",
          false: "Baptiste ne mange pas à la cantine aujourd'hui",
        }
      }
    },
    {
      title: 'GS',
      meta: {
        start: '17:00:00',
        end: '19:00:00',
        type: CalEventType.FAMILY,
        display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday',
        description: {
          true: "Baptiste va à la garderie ce soir",
          false: "Baptiste ne va pas à la garderie ce soir",
        }
      }
    },
    {
      title: 'CLSH',
      meta: {
        start: '07:30:00',
        end: '18:30:00',
        type: CalEventType.FAMILY,
        display: (day: CalendarMonthViewDay) => day.day == 3 || (!day.isWeekend && day.cssClass == 'holiday'),
        description: {
          true: "Baptiste va au centre de loisir aujourd'hui",
          false: "Baptiste ne va pas au centre de loisir aujourd'hui",
        }
      }
    }
  ]
  public formFields: CalEventField[] = [];

  public comments: CalEventDTO[] = [];

  constructor(
    private eventService: EventService,
    private dayService: DayClickedService,
    private destroy$: DestroyService,
    private modalService: ModalService,
    private mapper: MapperService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (isSameMonth(new Date(), this.viewDate) && isSameDay(this.day.date, this.viewDate)) this.isActive = true;
    this.comments = this.day.events.map((dayEvent: CalendarEvent) => ({ ...dayEvent })).filter((eventField: CalEventDTO) => eventField.meta!.type === CalEventType.COMMENT);
  }

  /**
   * initialize field : display or not & checked or not
   *
   * @private
   * @memberof CalMonthCellComponent
   */
  private initializeData(): void {
    this.emptyFields.forEach((field: CalEventField) => {
      let existField: CalendarEvent | undefined = this.day.events.find((dayEvent: CalendarEvent) => dayEvent.title === field.title);
      let formField: CalEventField = existField != undefined ? { id: existField.id as string, meta: { value: true } , ...field } : { meta: { value: false } , ...field };
      if (field.meta && field.meta.display && field.meta.display(this.day)) this.formFields.push(formField);
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
  public onCheck(formField: CalEventField) {
    if (!formField.meta!.value) {
      this.eventService.delete(formField.id as string).then(() => {
        console.log('delete ok');
      });
    } else if (formField.meta!.value) {
      const entity = this.mapper.fieldToEntity(formField, this.day.date);
      this.eventService.save(entity).then((id) => {
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
    const modal = this.modalService.openModal(this.target, CalMonthAddCommentComponent, this.day);
    modal.listenEvent().pipe(take(1)).subscribe(async (response: string) => {
      if (response) {
        const entity = this.mapper.commentToEntity(response, this.day.date);
        await this.eventService.save(entity);
        console.log('save ok');
      }
    })

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
