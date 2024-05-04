import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { VideoGAPI } from '../models/videoGAPI.interface';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    private URL_BACKEND: string = environment.urlFunctions;

    constructor(private http: HttpClient) { }

    addVideo(data: any): Observable<string> {
        return this.http.post<string>(this.URL_BACKEND, data.video, { responseType: 'json' });
    }

    updateVideo(video: VideoGAPI): Observable<string> {
        return this.http.put<string>(this.URL_BACKEND + '/' + video.videoId, video,  { responseType: 'json' });
    }

    findAll(): Observable<VideoGAPI[]> {
        return this.http.get<VideoGAPI[]>(this.URL_BACKEND, { responseType: 'json' });
    }

    findByCategorie(categorie: string): Observable<VideoGAPI[]> {
        return this.http.get<VideoGAPI[]>(this.URL_BACKEND + "/filtre/" + categorie, { responseType: 'json' });
    }

    deleteVideo(video: VideoGAPI): Observable<any> {
        return this.http.delete(this.URL_BACKEND + '/' + video.videoId, { responseType: 'json' });
    }

}


