import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';
import { DomSanitizer } from '@angular/platform-browser';
import { Selectable } from '@shared/components/select/select.component';

export class OrderYoutube implements Selectable<string> {
  value!: string;
  name!: string;
  public static readonly DATE = {value:'DATE', name:'Date'};
  public static readonly RATING = {value:'RATING', name:'Rating'};
  public static readonly RELEVANCE = {value:'RELEVANCE', name:'Relevance'};
  public static readonly TITLE = {value:'TITLE', name:'Title'};
  public static readonly VIDEOCOUNT = {value:'VIDEOCOUNT', name:'VideoCount'};
  public static readonly VIEWCOUNT = {value:'VIEWCOUNT', name:'ViewCount'};
} 

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private url: string = environment.urlApiYoutube;
  private params = {
    q: '',
    order: OrderYoutube.VIEWCOUNT.value,
    maxResults: 32,
    key: environment.youtubeToken,
    part: "snippet",
    type: "video"
  };

  constructor(private http: HttpClient, private _sanitizer: DomSanitizer) {}

  getVideos(keyword: string, order: OrderYoutube): Observable<any> {
    this.params.q = keyword;
    this.params.order = order.value;
    return this.http.get(this.url, {params: this.params}).pipe(
      map((response: any) =>
        response.items.map((item: any) => {    
          return {
            videoId: item.id.videoId,
            publishedAt: item.snippet.publishedAt,
            //publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
            title: this.decodeHTMLEntities(item.snippet.title),
            description: this.decodeHTMLEntities(item.snippet.description),
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
            src: `https://www.youtube.com/embed/${item.id.videoId}`,
            sanitized: this._sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${item.id.videoId}`),
          };
        })
      )
    );
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
