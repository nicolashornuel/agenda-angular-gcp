import {SymbolType} from './symbol.enum';

export interface ChartConf {
  hide_top_toolbar: boolean; // Afficher la barre d'outils supérieure
  withdateranges: boolean; // Afficher la barre d'outils inférieure
  hide_side_toolbar: boolean; // Afficher la barre d'outils de dessin
  watchlist: SymbolType[]; // Montrer la liste de surveillance
  details: boolean; // Montrer les Détails
  hotlist: boolean; // Afficher la Hotlist
  calendar: boolean; // Montrer le calendrier
  allow_symbol_change: boolean; // Autoriser le changement de symbole
  hide_legend: boolean; // Montrer la description du symbole
  range?: RangeChart; // Plage de dates par défault
  studies?: Indicator; // Montrer les indicateurs
  save_image: boolean; // Bouton "Obtenir image"
  enable_publishing: boolean; // Permettre la publication
  show_popup_button: boolean; // Lancement dans le bouton popup
  symbol: SymbolType; // Symbol par défaut
  interval?: IntervalChart; // Intervalle par défault
  timezone: string; //Fuseau horaire 'Europe/Brussels'
  autosize?: boolean; // Taille automatique
  width?: number; // Largeur
  height?: number; // Hauteur
  theme: string; // 'dark' | 'light',
  style: string; // Style de barre '1': bougies
  locale: string; // Langue 'fr'
}

export enum IntervalChart {
  _1m = '1',
  _3m = '3',
  _5m = '5',
  _15m = '15',
  _30m = '30',
  _1h = '60',
  _2h = '120',
  _3h = '180',
  _4h = '240',
  _1j = 'D',
  _1w = 'W'
}

export enum RangeChart {
  _1J = '1D',
  _5J = '5D',
  _1M = '1M',
  _3M = '3M',
  _6M = '6M',
  _YTD = 'YTD',
  _1Y = '12M',
  _5Y = '60M',
  _TOUT = 'ALL'
}

export enum Indicator {
  ADR = 'studyADR@tv-basicstudies',
  BB = 'BB@tv-basicstudies',
  CCI = 'CCI@tv-basicstudies',
  DC = 'DONCH@tv-basicstudies',
  MACD = 'MACD@tv-basicstudies',
  Mom = 'MOM@tv-basicstudies',
  MA = 'MASimple@tv-basicstudies',
  Ichimoku = 'IchimokuCloud@tv-basicstudies',
  PivotsHL = 'PivotPointsHighLow@tv-basicstudies',
  Pivots = 'PivotPointsStandard@tv-basicstudies',
  RSI = 'RSI@tv-basicstudies',
  StochRSI = 'StochasticRSI@tv-basicstudies',
  Stoch = 'Stochastic@tv-basicstudies'
}
