import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/abstracts/firestore.abstract';
import { AbstractItem } from '../models/memo.model';

@Injectable()
export class MemoService extends FirestoreService<AbstractItem> {
  constructor() {
    super();
  }
}
