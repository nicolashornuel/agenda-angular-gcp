import { Directive, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { PopoverService } from '@shared/services/shared.observable.service';
import { takeUntil } from 'rxjs';

@Directive({
  selector: '[appPopover]'
})
export class PopoverDirective implements OnInit, OnDestroy {
  @Input() appPopover!: TemplateRef<any>;
  @Input() classPosition: 'left' | 'right' | 'bottom' = 'left';
  private isDisplay: boolean = false;

  @HostListener('click')
  onClick(): void {
    if (this.isDisplay) {
      this.popoverService.set$(undefined);
    } else {
      const { height, width, x, y } = this.vcRef.element.nativeElement.getBoundingClientRect();
      let position;
      switch (this.classPosition) {
        case 'left':
          position = { top: `${y + height / 2}px`, left: `${x}px` };
          break;
        case 'right':
          position = { top: `${y + height / 2}px`, left: `${x + width}px` };
          break;
        case 'bottom':
          position = { top: `${y + height}px`, left: `${x + width / 2}px` };
          break;
      }
      this.popoverService.set$({ position, template: this.appPopover, classPosition: this.classPosition });
      this.isDisplay = !this.isDisplay;
    }
  }

  constructor(
    private vcRef: ViewContainerRef,
    private popoverService: PopoverService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.popoverService.get$.pipe(takeUntil(this.destroy$)).subscribe(param => {
      if (!param) this.destroy();
    });
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    this.isDisplay = !this.isDisplay;
    this.vcRef.clear();
  }
}
