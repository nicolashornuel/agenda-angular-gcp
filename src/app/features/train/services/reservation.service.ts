import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/abstracts/firestore.abstract';
import { Reservation } from '../models/reservation.model';

@Injectable()
export class ReservationService extends FirestoreService<Reservation> {
  constructor() {
    super('trainReservation');
  }
}
