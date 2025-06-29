import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements AfterViewInit {
  @Input() text: string = '';
  @ViewChild('textWrapper') textWrapper!: ElementRef;
  isExpanded = false;
  showMore = false;
  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit() {
    const el = this.textWrapper.nativeElement;
    if (el.scrollHeight > el.clientHeight) {
      this.showMore = true;
      this.isExpanded = false;
    } else {
      this.showMore = false;
      this.isExpanded = true;
    }
    // ✅ Réconcilie Angular avec le changement
    this.cdr.detectChanges();
  }
}
