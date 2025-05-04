import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import { DomSanitizer } from '@angular/platform-browser';
import { Selectable } from '@shared/models/fieldSet.model';

export class OrderYoutube implements Selectable<string> {
  value!: string;
  name!: string;
  public static readonly DATE = { value: 'DATE', name: 'Date' };
  public static readonly RATING = { value: 'RATING', name: 'Rating' };
  public static readonly RELEVANCE = { value: 'RELEVANCE', name: 'Relevance' };
  public static readonly TITLE = { value: 'TITLE', name: 'Title' };
  public static readonly VIDEOCOUNT = { value: 'VIDEOCOUNT', name: 'VideoCount' };
  public static readonly VIEWCOUNT = { value: 'VIEWCOUNT', name: 'ViewCount' };
}

class VideoParams {
  part = 'snippet,statistics';
  id!: string;
  key = environment.youtubeToken;
  constructor(id: string) {
    this.id = id;
  }
}
class SearchParams {
  q = '';
  order = OrderYoutube.VIEWCOUNT.value;
  maxResults = 32;
  key = environment.youtubeToken;
  part = 'id';
  type = 'video';
  constructor(q: string, order: string) {
    this.order = order;
    this.q = q;
  }
}
class YoutubeVideo {
  videoId!: string;
  publishedAt!: string;
  title!: string;
  description!: string;
  thumbnail!: string;
  channelTitle!: string;
  src!: string;
  sanitized!: any;
  viewCount: number;
  likeCount: number;
  constructor(
    {
      id,
      snippet: {
        publishedAt,
        title,
        description,
        thumbnails: {
          medium: { url }
        },
        channelTitle
      },
      statistics: { viewCount, likeCount, commentCount }
    }: any,
    _sanitizer: DomSanitizer
  ) {
    this.videoId = id;
    this.publishedAt = publishedAt;
    this.title = this.decodeHTMLEntities(title);
    this.description = this.decodeHTMLEntities(description);
    this.thumbnail = url;
    this.channelTitle = channelTitle;
    this.src = `https://www.youtube.com/embed/${id}`;
    this.sanitized = _sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`);
    this.viewCount = parseInt(viewCount);
    this.likeCount = parseInt(likeCount);
  }
  private decodeHTMLEntities(text: string) {
    var entities = [
      ['amp', '&'],
      ['apos', "'"],
      ['#x27', "'"],
      ['#x2F', '/'],
      ['#39', "'"],
      ['#47', '/'],
      ['lt', '<'],
      ['gt', '>'],
      ['nbsp', ' '],
      ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i)
      text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);

    return text;
  }
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private url: string = environment.urlApiYoutube;

  constructor(private http: HttpClient, private _sanitizer: DomSanitizer) {}

  getVideos(keyword: string, order: OrderYoutube): Observable<any> {
    return this.http.get(`${this.url}/search`, { params: { ...new SearchParams(keyword, order.value) } }).pipe(
      switchMap((response: any) =>
        this.http.get(`${this.url}/videos`, {
          params: { ...new VideoParams(response.items.map((item: any) => item.id.videoId).join(',')) }
        })
      ),
      map((response: any) => response.items.map((item: any) => new YoutubeVideo(item, this._sanitizer)))
    );
  }

  getViewCount(videoId: string): Observable<any> {
    return this.http.get(`${this.url}/videos`, { params: { ...new VideoParams(videoId) } }).pipe(
      map((response: any) => response.items[0].statistics)
    );
  }
}
