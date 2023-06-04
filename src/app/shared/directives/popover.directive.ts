import {
  Directive,
  HostListener,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { PopoverComponent } from '@shared/components/popover/popover.component';

@Directive({
  selector: '[appPopover]'
})
export class PopoverDirective implements OnDestroy {
  @Input() appPopover!: TemplateRef<any>;
  private isDisplay: boolean = false;

  @HostListener('click')
  onClick(): void {
    if (this.isDisplay) {
      this.isDisplay = !this.isDisplay;
      this.destroy();
    } else {
      const {height, width, x, y} = this.vcRef.element.nativeElement.getBoundingClientRect();
      const position = {top: `${y + height}px`, left: `${x + width / 2}px`}
      const child = this.vcRef.createComponent(PopoverComponent);
      child.instance.position = position;
      child.instance.template = this.appPopover;
      this.isDisplay = !this.isDisplay;
    }
  }

  constructor(private vcRef: ViewContainerRef) {}

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    this.vcRef.clear();
  }
}
