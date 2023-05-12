import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { EventService } from 'src/app/core/services/event.service';
import { EventField } from '../cal-month-cell/cal-month-cell.component';

export const collapseAnimation: AnimationTriggerMetadata = trigger('collapse', [
  state('void', style({
    height: 0,
    overflow: 'hidden',
    'padding-top': 0,
    'padding-bottom': 0,
  })
  ),
  state('*', style({
    height: '*',
    overflow: 'hidden',
    'padding-top': '*',
    'padding-bottom': '*',
  })
  ),
  transition('* => void', animate('150ms ease-out')),
  transition('void => *', animate('150ms ease-in')),
]);

@Component({
  selector: 'app-view-extra',
  templateUrl: './view-extra.component.html',
  styleUrls: ['./view-extra.component.scss'],
  animations: [collapseAnimation]
})
export class ViewExtraComponent implements OnChanges {

  @Input() viewDate!: Date;
  @Input() isOpen!: boolean;
  @Input() events!: CalendarEvent[];
  public comments: any[] = [];

  constructor(private eventService: EventService) { }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.events) {
      this.comments = this.events.map((event: CalendarEvent) => {
        return {
          ...event,
          onClick: async (e: CalendarEvent): Promise<void> => {
            await this.eventService.delete(e.id as string);
            console.log('delete ok');

          },
        } as unknown as EventField
      })
        .filter((eventField: EventField) => eventField.type === 'comment')

    }

  }


}
