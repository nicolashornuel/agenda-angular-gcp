import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeConvertService {

  //private serviceUrl = 'http://localhost:8080';
  private serviceUrl = environment.nodeService;

  constructor(private http: HttpClient) {}

  public convertYoutubeToMp3(videoId: string, cookie: string): Observable<any> {
    return this.http.post(`${this.serviceUrl}/convert`, { cookie, url: videoId }, { responseType: 'blob' });
  }
}
