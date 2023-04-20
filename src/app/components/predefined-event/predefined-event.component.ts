import { Component, ViewEncapsulation } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-predefined-event',
  templateUrl: './predefined-event.component.html',
  styleUrls: ['./predefined-event.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PredefinedEventComponent {

  externalEvents: CalendarEvent[] = [
    {
      title: 'Event 1',
      //color: colors.yellow,
      start: new Date(),
      draggable: true,
    },
    {
      title: 'Event 2',
      //color: colors.blue,
      start: new Date(),
      draggable: true,
      cssClass: 'my-custom-class'
    }
  ];

  constructor() {}


}
