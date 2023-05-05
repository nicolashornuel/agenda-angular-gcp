import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-cal-month-cell',
  templateUrl: './cal-month-cell.component.html',
  styleUrls: ['./cal-month-cell.component.scss']
})
export class CalMonthCellComponent implements OnInit, OnChanges {
  @Input() day!: CalendarMonthViewDay;
  @Input() locale!: string;
  @Input() isLocked!: boolean;
  formGroup: FormGroup = new FormGroup({});

  public formFields: { title: string, name: string, display: (day: CalendarMonthViewDay) => boolean, id: string, value: boolean }[] = [];
  public emptyFields = [
    {
      title: 'JOUR',
      name: 'jour',
      display: (_day: CalendarMonthViewDay) => true
    },
    {
      title: 'NUIT',
      name: 'nuit',
      display: (_day: CalendarMonthViewDay) => true
    },
    {
      title: 'Nounou',
      name: 'nounou',
      display: (day: CalendarMonthViewDay) => !day.isWeekend
    },
    {
      title: 'GM',
      name: 'garderie-matin',
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday'
    },
    {
      title: 'C',
      name: 'cantine',
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday'
    },
    {
      title: 'GS',
      name: 'garderie-soir',
      display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass != 'holiday'
    },
    {
      title: 'CLSH',
      name: 'centre-loisir',
      display: (day: CalendarMonthViewDay) => day.day == 3 || (!day.isWeekend && day.cssClass == 'holiday')
    }
  ];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {

    //this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['day'].currentValue);
    console.log(changes['day']);
    this.emptyFields.forEach(field => {      
      const toDisplay = field.display(changes['day'].currentValue)
      if (toDisplay) {
        let value = false;
        this.day.events.forEach(dayEvent => dayEvent.meta === field.name ? value = true : null)
        this.formFields.push({ id: 'id', value, ...field })
      }

    });
    /* if (changes['isLocked'] && !changes['isLocked'].isFirstChange()) {
      changes['isLocked'].currentValue ? this.formGroup.disable() : this.formGroup.enable();
    } */
  }

  /**
   * bind event into form
   *
   * @private
   * @memberof CalMonthCellComponent
   */
  private buildForm(): void {
    this.emptyFields.forEach(field => {
      if (field.display(this.day)) {
        let value = false;
        this.day.events.forEach(dayEvent => dayEvent.meta === field.title ? value = true : null)
        this.formGroup.addControl(field.title, new FormControl(value))
      }
    });
    this.formGroup.disable();
  }

  /**
   * save or delete onCLick checkbox
   *
   * @param {{key: string; value: AbstractControl}} {key, value}
   * @memberof CalMonthCellComponent
   */
  public onCheck({ key, value }: { key: string; value: AbstractControl }): void {
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
        this.day.events.push({id, ...newEvent });
        console.log('save ok');
      });
    }

  }
}
