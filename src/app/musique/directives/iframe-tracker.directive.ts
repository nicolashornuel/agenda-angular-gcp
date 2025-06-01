import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { RadioPlayingService } from 'app/radio/services/audio.observable.service';

@Directive({
  selector: '[iframeTracker]'
})
export class IframeTrackerDirective implements OnInit, OnDestroy {
  private iframeMouseOver!: boolean;

  @Input() debug!: boolean;

  @Output() iframeClick = new EventEmitter<ElementRef>();

  constructor(private el: ElementRef, private renderer: Renderer2, private playingService: RadioPlayingService) {}
  
  ngOnInit(): void {
    this.renderer.listen(window, 'blur', () => this.onWindowBlur());
  }
  
  ngOnDestroy(): void {
    this.playingService.set$(true);
  }
  
  @HostListener('mouseover')
  private onIframeMouseOver() {
    this.log('Iframe mouse over');
    this.iframeMouseOver = true;
    this.resetFocusOnWindow();
  }

  @HostListener('mouseout')
  private onIframeMouseOut() {
    this.log('Iframe mouse out');
    this.iframeMouseOver = false;
    this.resetFocusOnWindow();
  }

  private onWindowBlur() {
    if (this.iframeMouseOver) {
      this.log('WOW! Iframe click!!!');
      this.resetFocusOnWindow();
      this.playingService.set$(false);
      this.iframeClick.emit(this.el);
    }
  }

  private resetFocusOnWindow() {
    setTimeout(() => {
      this.log('reset focus to window');
      window.focus();
    }, 100);
  }

  private log(message: string) {
    if (this.debug) {
      console.log(message);
    }
  }
}
