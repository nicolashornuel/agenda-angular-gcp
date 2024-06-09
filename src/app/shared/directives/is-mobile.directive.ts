import { Directive, HostListener, OnInit } from '@angular/core';
import { IsMobileService } from '@shared/services/shared.observable.service';

@Directive({
  selector: '[isMobile]'
})
export class IsMobileDirective implements OnInit {

  constructor(private isMobileService: IsMobileService) {}

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event) {
    this.checkIsMobile();
  }

  ngOnInit() {
    this.checkIsMobile();
  }

  private checkIsMobile() {
    this.isMobileService.set$(window.innerWidth < 576);
  }
}
