import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { CalendarMonthViewDay } from 'angular-calendar';
import { isSameDay } from 'date-fns';

@Directive({
  selector: '[appScrollToday]'
})
export class ScrollTodayDirective implements OnInit {

  @Input() day!: CalendarMonthViewDay;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    if (isSameDay(this.day.date, new Date()))  {
      const scrollOptions = {
        behavior: 'smooth',
        block: 'start'
      };
      this.el.nativeElement.scrollIntoView(scrollOptions);
    }   
  }

  

}
