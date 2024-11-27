export interface Reservation {
  id?: string;
  travelReferency: string;
  fileStorage?: FileStorage;
  trajets: Trajet[];
}

export interface Trajet {
  id?: string;
  startAt: Date;
  endAt: Date;
  startPlace: string;
  endPlace: string;
  trainNumber: string;
  seatNumber?: string;
  price: number;
  subscriptionCard?: string;
  cancelation: string;
  isRefunded: boolean;
}

/* export interface FileStorage {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  lastModifiedDate: Date;
} */

export interface FileStorage {
  name?: string;
  link?: string;
  file?: File;
}

export class Train {
  public static readonly START_AT = { key: 'startAt', title: "Heure de départ" };
  public static readonly START_PLACE = { key: 'startPlace', title: "Lieu de départ" };
  public static readonly END_AT = { key: 'endAt', title: "Heure d'arrivée" };
  public static readonly END_PLACE = { key: 'endPlace', title: "Lieu d'arrivée" };
  public static readonly TRAIN_NUMBER = { key: 'trainNumber', title: "Train" };
  public static readonly SEAT_NUMBER = { key: 'seatNumber', title: "Place" };
  public static readonly PRICE = { key: 'price', title: "Tarif" };
  public static readonly SUBSCRIPTION = { key: 'subscriptionCard', title: "Réduction" };
  public static readonly CANCELATION = { key: 'cancelation', title: "Annulation" };
  public static readonly TRAVEL_REF = { key: 'travelReferency', title: "Dossier Voyage" };
  public static readonly FILE_STORAGE = { key: 'fileStorage', title: "Billet" };
  public static readonly REFUNDED = { key: 'isRefunded', title: "Remboursé" };
}
