import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { PopoverComponent } from '../components/ui-popover/ui-popover.component';

@Directive({
  selector: '[appPopover]'
})
export class PopoverDirective implements OnDestroy {
  @Input() appPopover!: TemplateRef<any>;
  private isDisplay: boolean = false;

  @HostBinding('class.active') get active() {
    return this.isDisplay;
  }

  @HostListener('click')
  onClick(): void {
    if (this.isDisplay) {
      this.destroy();
    } else {
      const { height, width, x, y } = this.vcRef.element.nativeElement.getBoundingClientRect();
      const position = { top: `${y + height}px`, left: `${x + width / 2}px` };
      const factory = this.resolver.resolveComponentFactory(PopoverComponent);
      const viewRef: ComponentRef<PopoverComponent> = this.vcRef.createComponent<PopoverComponent>(factory);
      viewRef.instance.position = position;
      viewRef.instance.template = this.appPopover!;
    }
    this.isDisplay = !this.isDisplay;
  }

  constructor(private vcRef: ViewContainerRef, private resolver: ComponentFactoryResolver) {}

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    this.vcRef.clear();
  }
}
