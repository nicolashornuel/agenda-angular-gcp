import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/abstracts/firestore.abstract';
import { RssFeed } from '../models/actualite.model';

@Injectable()
export class FirestoreRssFeedService extends FirestoreService<RssFeed> {
  
  constructor() {
    super('rssFeed');
  }
}
