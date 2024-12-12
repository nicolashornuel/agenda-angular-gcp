import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/services/firestore.service';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends FirestoreService<Reservation> {
  
  constructor() {
    super('trainReservation');
  }

}
