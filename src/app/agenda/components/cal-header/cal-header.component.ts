import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-cal-header',
  templateUrl: './cal-header.component.html',
  styleUrls: ['./cal-header.component.scss']
})
export class CalHeaderComponent {
  @Input() view!: CalendarView;

  @Input() viewDate!: Date;

  @Input() locale: string = 'fr';

  @Input() isLocked!: boolean;

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  @Output() isLockedChange = new EventEmitter<boolean>();


  CalendarView = CalendarView;

  @IsAdmin()
  public onToggleLock(): void {
    this.isLocked = !this.isLocked;
    this.isLockedChange.emit(this.isLocked)
  }

}
