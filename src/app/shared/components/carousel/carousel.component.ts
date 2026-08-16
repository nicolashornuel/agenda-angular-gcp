import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  QueryList,
  ViewChild
} from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterViewInit {
  @ContentChildren(CarouselItemDirective) items!: QueryList<CarouselItemDirective>;
  @ViewChild('carouselContent') carouselContent!: ElementRef;
  public loading = true;
  public position: number = 0;
  public hasPrevious = false;
  public hasNext = false;
  private hiddenWidth!: number;
  private itemWidth!: number;

  @HostBinding('class')
  get class(): string {
    return 'w-100';
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    let element = this.items.get(0)!.el.nativeElement;
    let style = element.currentStyle || window.getComputedStyle(element);
    let margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    let padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    let border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    const rect = element.getBoundingClientRect();
    this.itemWidth = rect.width + margin + border;
    /* this.itemWidth = rect.width + margin + padding + border; */
    this.hiddenWidth = this.items.length * this.itemWidth - this.carouselWidth;
    this.updateVisibility();
    this.loading = false;
    this.cdr.detectChanges();
  }

  next(): void {
    this.position -= Math.min(this.stepWidth, this.hiddenWidth - Math.abs(this.position));
    this.updateVisibility();
  }

  previous(): void {
    this.position += Math.min(this.stepWidth, Math.abs(this.position));
    this.updateVisibility();
  }

  private get stepWidth(): number {
    return Math.floor(this.carouselWidth / this.itemWidth) * this.itemWidth;
  }

  private get carouselWidth(): number {
    return this.carouselContent.nativeElement.getBoundingClientRect().width;
  }

  private updateVisibility(): void {
    this.hasPrevious = Math.round(this.position) < 0;
    this.hasNext = Math.abs(Math.floor(this.position)) < this.hiddenWidth;
  }
}
