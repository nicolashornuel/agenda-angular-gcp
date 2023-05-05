import { Component, Input, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { AbstractControl, FormGroup } from '@angular/forms';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-cal-month-cell',
  templateUrl: './cal-month-cell.component.html',
  styleUrls: ['./cal-month-cell.component.scss']
})
export class CalMonthCellComponent implements OnInit {
  @Input() day!: CalendarMonthViewDay;
  @Input() locale!: string;
  @Input() isLocked!: boolean;
  formGroup: FormGroup = new FormGroup({});

  public formFields: { title: string, name: string, display?: (day: CalendarMonthViewDay) => boolean, id?: string | number, value: boolean }[] = [];
  public emptyFields = [
    {
      title: 'JOUR',
      name: 'jour',
      start: '07:00:00',
      end: '19:00:00',
      display: (_day: CalendarMonthViewDay) => true
    },
    {
      title: 'NUIT',
      name: 'nuit',
      start: '19:00:00',
      end: '23:59:59',
      display: (_day: CalendarMonthViewDay) => true
    },
    {
      title: 'Nounou',
      name: 'nounou',
      start: '8:00:00',
      end: '16:30:00',
      display: (day: CalendarMonthViewDay) => !day.isWeekend
    },
    {
      title: 'GM',
      name: 'garderie-matin',
      start: '07:30:00',
      end: '09:00:00',
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday'
    },
    {
      title: 'C',
      name: 'cantine',
      start: '12:00:00',
      end: '14:00:00',
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday'
    },
    {
      title: 'GS',
      name: 'garderie-soir',
      start: '17:00:00',
      end: '19:00:00',
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday'
    },
    {
      title: 'CLSH',
      name: 'centre-loisir',
      start: '07:30:00',
      end: '18:30:00',
      display: (day: CalendarMonthViewDay) => day.day == 3 || (!day.isWeekend && day.cssClass == 'holiday')
    }
  ];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.initializeData();
  }

  /**
   * initialize field : display or not & checked or not
   *
   * @private
   * @memberof CalMonthCellComponent
   */
  private initializeData(): void {
    this.emptyFields.forEach(field => {
      let fieldToSave = { title: field.title, name: field.name, start: field.start, end: field.end }
      let existField = this.day.events.find(dayEvent => dayEvent.meta === field.name);
      let formField = existField != undefined ? { value: true, id: existField.id, ...fieldToSave } : { value: false, ...fieldToSave }
      if (field.display(this.day))
        this.formFields.push(formField);
    });
  }

  /**
   * save or delete onCLick checkbox
   *
   * @param {{key: string; value: AbstractControl}} {key, value}
   * @memberof CalMonthCellComponent
   */
/*   public onCheck({ key, value }: { key: string; value: AbstractControl }): void {
    const event = this.day.events.find(dayEvent => dayEvent.meta === key);
    if (event) {
      this.eventService.delete(event.id as string).then(() => {
        console.log('delete ok');
      });
    } else if (value.value) {
      const targetEvent: { title: string; name: string } | undefined = this.emptyFields
        .map(field => ({ name: field.name, title: field.title }))
        .find(field => field.title === key);
      const newEvent: CalendarEvent = {
        start: this.day.date,
        title: targetEvent!.title,
        meta: targetEvent!.name
      };
      const fireEvent: DocumentData = {
        start: this.day.date.getTime(),
        title: targetEvent!.title,
        meta: targetEvent!.name
      }
      this.eventService.save(fireEvent).then((id) => {
        this.day.events.push({ id, ...newEvent });
        console.log('save ok');
      });
    }
  } */

  public onCheck(formField: any) {
    console.log(formField);
    if (!formField.value && formField.id) {
      this.eventService.delete(formField.id as string).then(() => {
        console.log('delete ok');
      });
    } else if (formField.value && !formField.id) {
      let fieldToSave = { title: formField.title, name: formField.name, start: formField.start, end: formField.end }
      this.eventService.save(fieldToSave).then((id) => {
        this.day.events.push({ id, ...fieldToSave });
        console.log('save ok');
      });
    }
    
  }

}
