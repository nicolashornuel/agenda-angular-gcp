import { AfterViewInit, Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ScriptService } from '@shared/services/script.service';
import { Indicator } from '../model/chart-conf.interface';

declare let TradingView: any;

@Directive({
  selector: '[appWidgetChart]'
})
export class WidgetChartDirective implements AfterViewInit {

  @Input() width!: number | string;
  @Input() height!: number | string;
  
    //https://fr.tradingview.com/widget/advanced-chart/
    private name: string = 'Chart';
    private SCRIPT_PATH: string = 'https://s3.tradingview.com/tv.js';
    public options = {
      width: '100%', //980
      height: 610, //610
      //autosize: true,
      symbol: 'FX:EURUSD',
      interval: 'D',
      timezone: 'Europe/Brussels',
      theme: 'light', //dark
      style: '1',
      locale: 'fr',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: true,
      save_image: false,
      container_id: 'tradingview_e655f',
      details: true,
      hotlist: true,
      calendar: true,
      studies: [Indicator.Ichimoku, Indicator.BB, Indicator.Pivots]
    };
    @Input() symbol!: string;
  @Input() interval!: string;

  constructor(private el: ElementRef, private scriptService: ScriptService) {}

  ngAfterViewInit(): void {
    this.options.width = this.width as string;
    this.options.height = this.height  as number;
    this.options.container_id = this.el.nativeElement.id
    this.displayWidget(this.el);
  }

  private displayWidget(el: ElementRef) {
/*     const scriptElt = {
      src: this.SCRIPT_PATH,
      text: this.options,
      parentElt: el,
      name: this.name
    };
    this.scriptService.loadJsScriptEmbed(scriptElt); */

    const scriptElement = this.scriptService.loadJsScript(this.SCRIPT_PATH);
    scriptElement.onload = () => {
      console.log(`Tradingview ${this.name} Script loaded`);
      new TradingView.widget(this.options);
    };
    scriptElement.onerror = () => {
      console.log(`Could not load the Tradingview ${this.name} Script!`);
    };

  }
}
