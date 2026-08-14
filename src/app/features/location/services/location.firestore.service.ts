import { Injectable } from '@angular/core';
import { collectionData, limit, orderBy, query, where } from '@angular/fire/firestore';
import { FirestoreService } from '@core/services/firestore.service';
import { Observable } from 'rxjs';
import { TrackingLocation } from '../models/locations.constant';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends FirestoreService<TrackingLocation> {
  constructor() {
    super('locations');
  }

  public findByDateRange(key: string, startAt: number, endAt: number): Observable<TrackingLocation[]> {
    const q = query(this.collectionRef, where(key, '>=', startAt), where(key, '<', endAt));
    return collectionData(q, { idField: 'id' });
  }

  public getLast(count: number = 10): Observable<TrackingLocation[]> {
        const q = query(this.collectionRef, orderBy('time', 'desc'), limit(count));
        return collectionData(q, { idField: 'id' });
  }
}