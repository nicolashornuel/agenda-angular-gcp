import { Component, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { colors } from 'src/app/shared/models/colors.constant';

@Component({
  selector: 'app-predefined-event',
  templateUrl: './predefined-event.component.html',
  styleUrls: ['./predefined-event.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PredefinedEventComponent {


  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
       // this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        //this.handleEvent('Deleted', event);
      },
    },
  ];
  
  events: CalendarEvent[] = [
    {
      title: 'Romane chez Nounou',
      color: colors.yellow,
      start: new Date(),
      draggable: true,
      actions: this.actions
    },
    {
      title: 'Event 2',
      color: colors.blue,
      start: new Date(),
      draggable: true,
      cssClass: 'my-custom-class',
      actions: this.actions
    }
  ];

  constructor() {}


}
