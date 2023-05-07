import { ComponentRef, Directive, HostListener, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnDestroy {

  @Input() tooltip!: string;

  private childComponent!: ComponentRef<any>;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.childComponent = this.el.createComponent<TooltipComponent>(TooltipComponent);
    this.childComponent.instance.tooltip = this.tooltip;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }
  constructor(private el: ViewContainerRef) { }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
      this.childComponent.destroy();
  }
  

}
