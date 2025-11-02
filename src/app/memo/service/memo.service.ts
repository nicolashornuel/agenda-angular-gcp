import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/services/firestore.service';
import { AbstractField, AbstractItem } from '../models/memo.model';

@Injectable({
  providedIn: 'root'
})
export class MemoService extends FirestoreService<AbstractItem> {
  constructor() {
    super();
  }
}
