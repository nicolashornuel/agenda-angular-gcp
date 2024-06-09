import { AfterViewInit, Component, ContentChildren, ElementRef, HostBinding, QueryList, ViewChild } from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterViewInit {

  @ContentChildren(CarouselItemDirective) items!: QueryList<CarouselItemDirective>;
  @ViewChild('translateBloc') translateBloc!: ElementRef<any>;
  public loading = true;
  public position: number = 0;
  public hasPrevious!: boolean;
  public hasNext!: boolean;
  private stepWidth!: number;
  private hiddenWidth!: number; 

  @HostBinding('class')
  get class(): string {
    return 'w-100';
  }

  ngAfterViewInit(): void {
    const itemWidth =  this.items.map(item => item.el.nativeElement.getBoundingClientRect().width).at(0);
    const carouselWidth = this.translateBloc.nativeElement.getBoundingClientRect().width;
    this.hiddenWidth = (this.items.length * itemWidth) - carouselWidth;
    this.stepWidth = this.hiddenWidth / Math.floor(this.hiddenWidth / itemWidth);
    this.updateVisibility();
    this.loading = false;
  }

  next(): void {
    this.position -= this.stepWidth;
    this.updateVisibility();
  }

  previous(): void {
    this.position += this.stepWidth;
    this.updateVisibility();
  }

  private updateVisibility(): void {
    this.hasPrevious = Math.round(this.position) < 0;    
    this.hasNext = Math.abs(Math.floor(this.position)) < this.hiddenWidth;
  }
}
