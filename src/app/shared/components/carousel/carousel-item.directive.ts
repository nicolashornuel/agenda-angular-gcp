import { Directive, ElementRef, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCarouselItem]'
})
export class CarouselItemDirective {
  constructor(public el: ElementRef<any>) { 
  }

}
