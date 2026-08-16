import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/abstracts/firestore.abstract';

@Injectable({
  providedIn: 'root'
})
export class VisitService extends FirestoreService<any> {
  constructor() {
    super('visit');
  }
}
