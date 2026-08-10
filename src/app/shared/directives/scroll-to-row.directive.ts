import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appScrollToRow]'
})
export class ScrollToRowDirective {
  private previousValue = false;

  @Input()
  set appScrollToRow(isCurrent: boolean | null | undefined) {
    if (isCurrent && !this.previousValue) {
      this.scrollIntoView();
    }

    this.previousValue = !!isCurrent;
  }

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  private scrollIntoView(): void {
    this.elementRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}
