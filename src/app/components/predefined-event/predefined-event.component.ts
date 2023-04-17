import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { colors } from 'src/app/models/colors.constant';

@Component({
  selector: 'app-predefined-event',
  templateUrl: './predefined-event.component.html',
  styleUrls: ['./predefined-event.component.scss']
})
export class PredefinedEventComponent {

  externalEvents: CalendarEvent[] = [
    {
      title: 'Event 1',
      color: colors.yellow,
      start: new Date(),
      draggable: true,
    },
    {
      title: 'Event 2',
      color: colors.blue,
      start: new Date(),
      draggable: true,
    },
  ];

  events: CalendarEvent[] = [];

  externalDrop(event: CalendarEvent) {
    if (this.externalEvents.indexOf(event) === -1) {
      this.events = this.events.filter((iEvent) => iEvent !== event);
      this.externalEvents.push(event);
    }
  }

}
