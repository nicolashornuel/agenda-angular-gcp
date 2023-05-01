import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appIsLocked]'
})
export class IsLockedDirective {

  @Input() isLocked: boolean = true;
  
  @Output() isLockedChange = new EventEmitter<boolean>();

  @HostListener('click') toggleLockInput() {
    this.isLocked = !this.isLocked;
    console.log('toggleLock' + this.isLocked);
    this.isLockedChange.emit(this.isLocked)
  }


  constructor(private el: ElementRef) { }

  

}
