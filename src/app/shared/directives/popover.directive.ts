import { ComponentRef, Directive, HostListener, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { PopoverComponent } from '@shared/components/popover/popover.component';

@Directive({
  selector: '[appPopover]'
})
export class PopoverDirective implements OnDestroy {
  @Input() appPopover!: TemplateRef<any>
  private childComponent!: ComponentRef<any>;
  private isDisplay: boolean = false;

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    this.el.createEmbeddedView(this.appPopover);
    //this.childComponent = this.el.createComponent(PopoverComponent, {projectableNodes: [[this.appPopover as HTMLElement]]});
  }

  constructor(private el: ViewContainerRef) { }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.childComponent) {
      this.childComponent.destroy();
    }
  }

}
