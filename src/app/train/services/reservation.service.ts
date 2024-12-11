import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/services/firestore.service';
import { Reservation, TrajetStatus } from '../models/reservation.model';
import { StopArea } from '../models/sncf.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends FirestoreService<Reservation> {
  
  constructor() {
    super('trainReservation');
  }

}
