import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { CalendarMonthViewDay } from 'angular-calendar';

@Directive({
  selector: '[appMonthCell]'
})
export class MonthCellDirective implements OnInit {
  @Input() day!: CalendarMonthViewDay;
  @Input() locale!: string;
  @Input() isLocked!: boolean;

  constructor(private el: ElementRef) { }
  ngOnInit(): void {
    console.log(this.day.cssClass);
  }

}
