import { Directive, HostListener, OnInit } from '@angular/core';
import { IsMobileService, ViewPortService } from '@shared/services/shared.observable.service';

@Directive({
  selector: '[isMobile]'
})
export class IsMobileDirective implements OnInit {

  constructor(private isMobileService: IsMobileService, private viewPortService: ViewPortService) {}

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event) {
    this.check();
  }

  ngOnInit() {
    this.check();
  }

  private check() {
    this.isMobileService.set$(window.innerWidth < 576);
    this.viewPortService.set$(window.innerWidth);
  }
}
