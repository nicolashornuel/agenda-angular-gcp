import { FileStorage } from '@core/services/firebasestorage.service';
import { Color } from '@shared/models/color.enum';
import { Selectable } from '@shared/models/fieldSet.model';
import { StopArea } from './sncf.model';

export interface Identifiable {
  id?: string;
}

export interface Reservation extends Identifiable {
  startAt: Date | string;
  startPlace?: StopArea;
  endAt: Date | string;
  endPlace?: StopArea;
  trainNumber: string;
  seatNumber?: string; //pas vraiment nécessaire
  price: number;
  subscriptionCard?: boolean;
  cancelation: string;
  status: TrajetStatus;
  fileStorage?: FileStorage;
  travelReferency: string;
}

export class Reservation {

  public static readonly START_AT = { key: 'startAt', name: 'Heure de départ' };
  public static readonly START_PLACE = { key: 'startPlace', name: 'Lieu de départ' };
  public static readonly END_AT = { key: 'endAt', name: "Heure d'arrivée" };
  public static readonly END_PLACE = { key: 'endPlace', name: "Lieu d'arrivée" };
  public static readonly TRAIN_NUMBER = { key: 'trainNumber', name: 'Train' };
  public static readonly SEAT_NUMBER = { key: 'seatNumber', name: 'Place' };
  public static readonly PRICE = { key: 'price', name: 'Tarif' };
  public static readonly SUBSCRIPTION = { key: 'subscriptionCard', name: 'Carte Liberté' };
  public static readonly CANCELATION = { key: 'cancelation', name: 'Annulation' };
  public static readonly STATUS = { key: 'status', name: 'Status' };
  public static readonly FILE_STORAGE = { key: 'fileStorage', name: 'Billet' };
  public static readonly TRAVEL_REF = { key: 'travelReferency', name: 'Dossier Voyage' };
  
  constructor() {
    this.startAt = new Date();
    this.startPlace = StopArea.BAILLARGUES;
    this.endAt = new Date();
    this.endPlace = StopArea.BOURG_EN_BRESSE;
    this.trainNumber = '';
    this.seatNumber = '';
    this.travelReferency = '';
    this.price = 0.0;
    this.subscriptionCard = true;
    this.cancelation = '';
    this.status = TrajetStatus.WAITING;
    this.fileStorage = undefined;
  }
}

export class TrajetStatus implements Selectable<string> {
  name!: string;
  value!: string;
  color?: Color;
  order!: number;
  public static readonly WAITING = { order: 1, name: 'En cours', value: 'waiting', color: Color.BLUE };
  public static readonly CANCELED = { order: 2, name: 'Annulé', value: 'canceled', color: Color.RED };
  public static readonly REFUNDED = { order: 3, name: 'Remboursé', value: 'refunded', color: Color.GREEN };
}
