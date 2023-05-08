import { ComponentRef, Directive, HostListener, Input, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef } from '@angular/core';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnDestroy, OnChanges {

  @Input() tooltip!: string;

  private childComponent!: ComponentRef<any>;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.childComponent = this.el.createComponent<TooltipComponent>(TooltipComponent);
    this.setTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }
  constructor(private el: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['tooltip'].firstChange) this.setTooltip();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.childComponent) {
      this.childComponent.destroy();
    }
  }

  private setTooltip(): void {
    this.childComponent.instance.tooltip = this.tooltip;
  }
  

}
