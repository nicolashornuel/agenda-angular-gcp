import {
  Directive,
  HostListener,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { PopoverService } from '@shared/services/popover.service';

@Directive({
  selector: '[appPopover]'
})
export class PopoverDirective implements OnDestroy {
  @Input() appPopover!: TemplateRef<any>;
  @Input() classPosition: 'left' | 'bottom' = 'left';
  private isDisplay: boolean = false;

  @HostListener('click')
  onClick(): void {
    if (this.isDisplay) {
      this.isDisplay = !this.isDisplay;
      this.destroy();
    } else {
      const {height, width, x, y} = this.vcRef.element.nativeElement.getBoundingClientRect();
      let position;
      switch (this.classPosition) {
        case 'left': position = {top: `${y + height / 2}px`, left: `${x}px`}
          break;
        case 'bottom': position = {top: `${y + height}px`, left: `${x + width / 2}px`}
          break;
      }
      this.popoverService.set$({position, template: this.appPopover, classPosition: this.classPosition});
      this.isDisplay = !this.isDisplay;
    }
  }

  constructor(private vcRef: ViewContainerRef, private popoverService: PopoverService) {}

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    this.popoverService.set$(undefined);
    this.vcRef.clear();
  }
}
