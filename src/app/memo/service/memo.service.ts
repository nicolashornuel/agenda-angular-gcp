import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class MemoService extends FirestoreService<any> {
  constructor() {
    super();
  }
}
