import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Selectable } from '@shared/models/fieldSet.model';
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

export interface QueryGAPI {
  q: string;
  order: string;
  maxResults: number;
  key: string;
  part: string;
  type: string;
}

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

class ChannelNameParams {
  readonly part = 'snippet';
  readonly type = 'channel';
  readonly maxResults = 1;
  readonly key = environment.youtubeToken;
  constructor(public readonly q: string) {}
}
class ChannelIdParams {
  readonly part = 'snippet';
  readonly type = 'video';
  readonly order = 'date';
  readonly maxResults = 18;
  readonly key = environment.youtubeToken;
  constructor(public readonly channelId: string) {}
}
class VideoParams {
  readonly part = 'snippet,statistics';
  readonly key = environment.youtubeToken;
  constructor(public readonly id: string) {}
}
class SearchParams {
  readonly maxResults = 18;
  readonly key = environment.youtubeToken;
  readonly part = 'id'; // snippet
  readonly type = 'video';
  constructor(public readonly q: string) {}
}
class YoutubeVideo {
  videoId!: string;
  publishedAt!: string;
  title!: string;
  description!: string;
  thumbnail!: string;
  channelTitle!: string;
  src!: string;
  viewCount: number;
  likeCount: number;
  channelId!: string;
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
        channelTitle,
        channelId
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
    this.channelId = channelId;
    this.src = `https://www.youtube.com/embed/${id}`;
    this.viewCount = viewCount ? parseInt(viewCount) : 0;
    this.likeCount = likeCount ? parseInt(likeCount) : 0;
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
export class YoutubeSearchService {
  private url: string = environment.urlApiYoutube;

  constructor(
    private http: HttpClient,
    private _sanitizer: DomSanitizer
  ) {}

  getVideos(keyword: string): Observable<any> {
    return this.http.get(`${this.url}/search`, { params: { ...new SearchParams(keyword) } }).pipe(
      switchMap((response: any) =>
        this.http.get(`${this.url}/videos`, {
          params: { ...new VideoParams(response.items.map((item: any) => item.id.videoId).join(',')) }
        })
      ),
      map((response: any) => response.items.map((item: any) => new YoutubeVideo(item, this._sanitizer)))
    );
  }

  getViewCount(videoId: string): Observable<any> {
    return this.http
      .get(`${this.url}/videos`, { params: { ...new VideoParams(videoId) } })
      .pipe(map((response: any) => response.items[0].statistics));
  }

  getVideosFromChannelId(channelId: string): Observable<any> {
    return this.http
      .get(`${this.url}/search`, { params: { ...new ChannelIdParams(channelId) } })
      .pipe(map((response: any) => response.items.map((item: any) => new PlaylistVideo(item, this._sanitizer))));
  }

  getVideosFromChannelName(channelName: string): Observable<any> {
    return this.http.get(`${this.url}/search`, { params: { ...new ChannelNameParams(channelName) } }).pipe(
      switchMap((response: any) => {
        const channelId = response.items?.[0]?.id?.channelId;
        return channelId ? this.getVideosFromChannelId(channelId) : throwError(() => new Error('Chaîne introuvable'));
      })
    );
  }
}

class PlaylistVideo {
  videoId!: string;
  publishedAt!: Date;
  title!: string;
  description!: string;
  thumbnail!: string;
  channelTitle!: string;
  channelId!: string;
  src!: string;
  constructor(
    {
      id: { videoId },
      snippet: {
        publishedAt,
        title,
        description,
        thumbnails: {
          medium: { url }
        },
        channelTitle,
        channelId
      }
    }: any,
    _sanitizer: DomSanitizer
  ) {
    this.videoId = videoId;
    this.publishedAt = publishedAt;
    this.title = this.decodeHTMLEntities(title);
    this.description = this.decodeHTMLEntities(description);
    this.thumbnail = url;
    this.channelTitle = channelTitle;
    this.channelId = channelId;
    this.src = `https://www.youtube.com/embed/${videoId}`;
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
