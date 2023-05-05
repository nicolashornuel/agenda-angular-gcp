import { Component, Input, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { AbstractControl, FormGroup } from '@angular/forms';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { EventService } from 'src/app/core/services/event.service';

interface FormField<MetaType = any> {
  id?: string | number,
  title: string,
  description: string,
  start: string,
  end?: string,
  value: boolean,
  meta?: MetaType;
}
type EmptyField = FormField<{ display: (day: CalendarMonthViewDay) => boolean }>;

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

  public formFields: FormField[] = [];
  public emptyFields: EmptyField[] = [
    {
      title: 'JOUR',
      description: 'jour',
      start: '07:00:00',
      end: '19:00:00',
      value: false,
      meta: {
        display: (_day: CalendarMonthViewDay) => true
      }
    },
    {
      title: 'NUIT',
      description: 'nuit',
      start: '19:00:00',
      end: '23:59:59',
      value: false,
      meta: {
      display: (_day: CalendarMonthViewDay) => true
    }
    },
    {
      title: 'Nounou',
      description: 'nounou',
      start: '8:00:00',
      end: '16:30:00',
      value: false,
      meta: {
      display: (day: CalendarMonthViewDay) => !day.isWeekend
    }
    },
    {
      title: 'GM',
      description: 'garderie-matin',
      start: '07:30:00',
      end: '09:00:00',
      value: false,
      meta: {
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday'
    }
    },
    {
      title: 'C',
      description: 'cantine',
      start: '12:00:00',
      end: '14:00:00',
      value: false,
      meta: {
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday'
    }
    },
    {
      title: 'GS',
      description: 'garderie-soir',
      start: '17:00:00',
      end: '19:00:00',
      value: false,
      meta: {
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday'
    }
    },
    {
      title: 'CLSH',
      description: 'centre-loisir',
      start: '07:30:00',
      end: '18:30:00',
      value: false,
      meta: {
      display: (day: CalendarMonthViewDay) => day.day == 3 || (!day.isWeekend && day.cssClass == 'holiday')
    }
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

      let fieldToSave = { title: field.title, description: field.description, start: field.start, end: field.end }
      let existField = this.day.events.find(event => event.title === field.title);
      let formField = existField != undefined ? { value: true, id: existField.id, ...fieldToSave } : { value: false, ...fieldToSave }
      if (field.meta!.display(this.day))
        this.formFields.push(formField);


      /* let fieldToSave = { title: field.title, description: field.description, start: field.start, end: field.end }
      let existField = this.day.events.find(dayEvent => dayEvent.title === field.title);
      let formField = existField != undefined ? { value: true, id: existField.id, ...fieldToSave } : { value: false, ...fieldToSave }
      if (field.display(this.day))
        this.formFields.push(formField); */
    });
  }

  /**
   * onCLick checkbox to save or delete 
   *
   * @param {*} formField
   * @memberof CalMonthCellComponent
   */
  public onCheck(formField: any) {
    console.log(formField);
/*     if (!formField.value && formField.id) {
      this.eventService.delete(formField.id as string).then(() => {
        console.log('delete ok');
      });
    } else if (formField.value && !formField.id) {
      let fieldToSave = { title: formField.title, name: formField.name, start: formField.start, end: formField.end }
      this.eventService.save(fieldToSave).then((id) => {
        this.day.events.push({ id, ...fieldToSave });
        console.log('save ok');
      });
    } */
    
  }

}
