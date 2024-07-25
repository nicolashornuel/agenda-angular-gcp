import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends FirestoreService<any> {
  constructor() {
    super('locations');
  }
}
