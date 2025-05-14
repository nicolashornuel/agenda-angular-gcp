import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeConvertService {

  private serviceUrl = environment.ffmpegService;

  constructor(private http: HttpClient) {}

  public convertYoutubeToMp3(videoId: string): Observable<any> {
    return this.http.get(`${this.serviceUrl}/convert`, { params: { url: videoId } });
  }
}
