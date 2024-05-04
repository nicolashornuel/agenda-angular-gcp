import {
  ComponentRef,
  Directive,
  HostListener,
  Input,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnDestroy {
  @Input() appTooltip!: string;

  private childComponent!: ComponentRef<any>;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.childComponent = this.el.createComponent<TooltipComponent>(TooltipComponent);
    const {height, width, x, y} = this.el.element.nativeElement.getBoundingClientRect();
    this.childComponent.instance.param = {
      position: {top: `${y + height}px`, left: `${x + width / 2}px`},
      content: this.appTooltip
    };
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }
  constructor(private el: ViewContainerRef) {}

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.childComponent) {
      this.childComponent.destroy();
    }
  }
}
