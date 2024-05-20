import {AfterViewInit, Component, ContentChildren, ElementRef, HostBinding, OnInit, QueryList, ViewChild} from '@angular/core';
import {CarouselItemDirective} from './carousel-item.directive';

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
    this.updateArrow();
    this.loading = false;
  }

  next(): void {
    this.position -= this.stepWidth;
    this.updateArrow();
  }

  previous(): void {
    this.position += this.stepWidth;
    this.updateArrow();
  }

  updateArrow(): void {
    this.hasPrevious = this.position < 0;
    this.hasNext = Math.abs(this.position) < this.hiddenWidth;
  }
}
