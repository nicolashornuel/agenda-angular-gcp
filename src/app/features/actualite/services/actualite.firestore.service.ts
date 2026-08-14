import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/services/firestore.service';
import { RssFeed } from '../models/actualite.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreRssFeedService extends FirestoreService<RssFeed> {
  
  constructor() {
    super('rssFeed');
  }
}
