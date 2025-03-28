import { Injectable } from '@angular/core';
import { RssFeed } from '../models/rss-feed.model';
import { SubjectService } from '@shared/abstracts/observable.abstract';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RssObservableService extends SubjectService<RssFeed[]> {
  private rssFeed: RssFeed[] | null | undefined;

  public override set$(value: RssFeed[] | null | undefined): void {
    this.rssFeed = value;
    super.set$(value);
  }

  public override get get$(): Observable<RssFeed[] | null | undefined> {
    return this.rssFeed ? of(this.rssFeed) :  super.get$;
  }
}
