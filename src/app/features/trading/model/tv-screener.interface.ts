export interface TvScreener {
  market: MarketType;
  locale: string; // 'fr
  defaultColumn: DefaultColumnType; // GLOBAL = 'overview'
  defaultScreen: DefaultScreenType;
  showToolbar: boolean; // Afficher la barre d'outils supérieure
  colorTheme: string; // "dark" | "light",
  isTransparent: boolean;
  width: string | number; // 100% or 1100,
  height: string | number; // 100% or 523,
}

export enum MarketType {
  AMERICA = 'america',
  GERMANY = 'germany',
  FOREX = 'forex',
  CRYPTO = 'crypto'
}

export enum DefaultColumnType {
  GLOBAL = 'overview',
  PERFORMANCE = 'performance',
  OSCILLATORS = 'oscillators',
  TREND_FOLLOWING = 'moving_averages'
}

export enum DefaultScreenType {
  GENERAL = 'general', // Général
  TOP_GAINERS = 'top_gainers', // Paires montantes
  TOP_LOSERS = 'top_losers', // Paires descendantes
  ATH = 'ath', // Sommet historique
  ATL = 'atl', // Creux historique
  ABOVE_52WK_HIGH = 'above_52wk_high', // Nouveau plus haut de 52 semaines
  BELOW_52WK_LOW = 'below_52wk_low', // Nouveau plus bas de 52 semaines
  MONTHLY_HIGH = 'monthly_high', // Nouveau plus haut mensuel
  MONTHLY_LOW = 'monthly_low', // Nouveau plus bas mensuel
  MOST_VOLATILE = 'most_volatile', // Les plus volatiles
  OVERBOUGHTS = 'overbought', // Surachetées
  OVERSOLD = 'oversold', // Survendues
  OUTPERFORMING_SMA50 = 'outperforming_SMA50', // SMA50 sur-performante
  UNDERFORMING_SMA50 = 'underforming_SMA50' // SMA50 sous-performante
}

function getDetail(type: DefaultScreenType): string | null {
  switch (type) {
    case DefaultScreenType.GENERAL:
      return 'Général';
    case DefaultScreenType.TOP_GAINERS:
      return 'Paires montantes';
    case DefaultScreenType.TOP_LOSERS:
      return 'Paires montantes';
    case DefaultScreenType.ATH:
      return 'Paires montantes';
    case DefaultScreenType.ATL:
      return 'Paires montantes';
      case DefaultScreenType.ABOVE_52WK_HIGH:
      return 'Paires montantes';
    case DefaultScreenType.BELOW_52WK_LOW:
      return 'Paires montantes';
    case DefaultScreenType.MONTHLY_HIGH:
      return 'Paires montantes';
    case DefaultScreenType.MONTHLY_LOW:
      return 'Paires montantes';
      case DefaultScreenType.MOST_VOLATILE:
      return 'Paires montantes';
    case DefaultScreenType.OVERBOUGHTS:
      return 'Paires montantes';
    case DefaultScreenType.ATH:
      return 'Paires montantes';
    case DefaultScreenType.ATL:
      return 'Paires montantes';
  }
  return null;
}
