export interface TvForexHeatMap {
    width: string | number; //770,
    height: string | number; //400,
    currencies: CurrenciesType[],
    isTransparent: boolean,
    colorTheme: string; // "dark" | "light",
    locale: string; // 'fr
}

export enum CurrenciesType {
    EUR = 'EUR',
    USD = 'USD',
    GBP = 'GBP',
    JPY = 'JPY',
    AUD = 'AUD',
    CAD = 'CAD',
    NZD = 'NZD',
    CHF = 'CHF',
    //CNY = 'CNY', //no available inside fxcm
    //TRY = 'TRY', //no available inside fxcm
    //SEK = 'SEK', //no available inside fxcm
  }

