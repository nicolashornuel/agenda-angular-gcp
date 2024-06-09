import { SymbolType } from "./symbol.enum";

export interface TvAnalysis {
    interval: IntervalType | string,
    width: string | number, //425 or '100%'
    isTransparent: boolean, //true
    height: string | number, //450 or '100%'
    symbol: SymbolType | string,
    showIntervalTabs: boolean, //true
    locale: string, //'fr',
    colorTheme: string; // "dark" | "light",
}


export enum IntervalType {
    _1m = '1m',
    _5m = '5m',
    _15m = '15m',
    _30m = '30m',
    _1h = '1h',
    _2h = '2h',
    _4h = '4h',
    _1D = '1D',
    _1W = '1W',
    _1M = '1M',
  }
