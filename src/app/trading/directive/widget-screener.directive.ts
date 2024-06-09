import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import { ScriptService } from '@shared/services/script.service';
import { TvScreener, MarketType, DefaultColumnType, DefaultScreenType } from '../model/tv-screener.interface';


@Directive({
  selector: '[appWidgetScreener]'
})
export class WidgetScreenerDirective implements AfterViewInit {

  @Input() width!: number | string;
  @Input() height!: number | string;

  //https://fr.tradingview.com/widget/screener/
  public name: string = 'Screener';
  private SCRIPT_PATH: string = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
  public options: TvScreener = {
    market: MarketType.FOREX,
    locale: 'fr',
    defaultColumn: DefaultColumnType.GLOBAL, // GLOBAL = 'overview'
    defaultScreen: DefaultScreenType.GENERAL,
    showToolbar: true, // Afficher la barre d'outils supérieure
    colorTheme: 'light', // "dark" | "light",
    isTransparent: false,
    width: '100%', // 100% or 1100,
    height: '100%'// 100% or 523,
  };
  public scriptElt!: HTMLScriptElement;

  constructor(private el: ElementRef, private scriptService: ScriptService) {
  }

  ngAfterViewInit(): void {
    this.options.width = this.width;
    this.options.height = this.height;
    this.displayWidget(this.el);
  }

  private displayWidget(el: ElementRef) {
    const scriptElt = {
      src: this.SCRIPT_PATH,
      text: this.options,
      parentElt: el,
      name: this.name
    };
    this.scriptElt = this.scriptService.loadJsScriptEmbed(scriptElt);
  }
}
