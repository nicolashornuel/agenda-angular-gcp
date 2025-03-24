import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/services/firestore.service';
import { RssFeed } from '../models/rss-feed.model';

@Injectable({
  providedIn: 'root'
})
export class RssFeedService extends FirestoreService<RssFeed> {
  
  constructor() {
    super('rssFeed');
  }

}
