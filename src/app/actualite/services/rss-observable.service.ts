import { Injectable } from '@angular/core';
import { RssFeed } from '../models/rss-feed.model';
import { SubjectService } from '@shared/abstracts/observable.abstract';

@Injectable({
  providedIn: 'root'
})
export class RssObservableService extends SubjectService<RssFeed[]> {}
