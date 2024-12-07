import { FileStorage } from "@shared/components/input-file/input-file.component";
import { Selectable } from "@shared/components/select/select.component";
import { FieldSet } from "@shared/models/tableSet.interface";
import { StopArea } from "./sncf.model";

export interface Reservation {
  id?: string;
  startAt: Date;
  startPlace?: StopArea;
  endAt: Date;
  endPlace?: StopArea;
  trainNumber: string;
  seatNumber?: string;
  price: number;
  subscriptionCard?: string;
  cancelation: string;
  status: TrajetStatus;
  fileStorage?: FileStorage;
  travelReferency: string;
}

export class Reservation {
  constructor() {
    this.startAt = new Date();
    this.endAt = new Date();
    this.status = TrajetStatus.WAITING;
  }
}

export class TrajetStatus implements Selectable<string> {
  value!: string;
  name!: string;
  public static readonly REFUNDED = {name: "Remboursé", value:"refunded"};
  public static readonly CANCELED = {name: "Annulé", value:"canceled"};
  public static readonly WAITING = {name: "En cours", value:"waiting"};
}

export class Train implements FieldSet {
  key!: string;
  name!: string;
  public static readonly START_AT = { key: 'startAt', name: "Heure de départ" };
  public static readonly START_PLACE = { key: 'startPlace', name: "Lieu de départ" };
  public static readonly END_AT = { key: 'endAt', name: "Heure d'arrivée" };
  public static readonly END_PLACE = { key: 'endPlace', name: "Lieu d'arrivée" };
  public static readonly TRAIN_NUMBER = { key: 'trainNumber', name: "Train" };
  public static readonly SEAT_NUMBER = { key: 'seatNumber', name: "Place" };
  public static readonly PRICE = { key: 'price', name: "Tarif" };
  public static readonly SUBSCRIPTION = { key: 'subscriptionCard', name: "Réduction" };
  public static readonly CANCELATION = { key: 'cancelation', name: "Annulation" };
  public static readonly STATUS = { key: 'status', name: "Status" };
  public static readonly FILE_STORAGE = { key: 'fileStorage', name: "Billet" };
  public static readonly TRAVEL_REF = { key: 'travelReferency', name: "Dossier Voyage" };
}