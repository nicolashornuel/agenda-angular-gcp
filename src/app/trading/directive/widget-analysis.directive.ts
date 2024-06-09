import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import { IntervalType, TvAnalysis } from '../model/tv-analysis.interface';
import { SymbolType } from '../model/symbol.enum';
import { ScriptService } from '@shared/services/script.service';


@Directive({
  selector: '[appWidgetAnalysis]'
})
export class WidgetAnalysisDirective implements OnInit, OnChanges {
  //https://fr.tradingview.com/widget/technical-analysis/
  public name: string = 'Analysis';
  private SCRIPT_PATH: string = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
  public options: TvAnalysis = {
    interval: IntervalType._1h,
    width: 425, //425
    isTransparent: true,
    height: 450, //450
    symbol: SymbolType.AUDUSD,
    showIntervalTabs: true,
    locale: 'fr',
    colorTheme: 'light'
  };
  @Input() symbol!: string;
  @Input() interval!: string;

  constructor(private el: ElementRef, private scriptService: ScriptService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.options.interval = this.interval;
    changes['symbol'] ? this.options.symbol = changes['symbol'].currentValue : null;
    const firstChild = this.el.nativeElement.firstChild;
    firstChild ? firstChild.remove() : null;
    this.displayWidget(this.el);
  }

  private displayWidget(el: ElementRef) {
    const scriptElt = {
      src: this.SCRIPT_PATH,
      text: this.options,
      parentElt: el,
      name: this.name
    };
    this.scriptService.loadJsScriptEmbed(scriptElt);
  }
}
