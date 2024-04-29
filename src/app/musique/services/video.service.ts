import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    private URL_BACKEND: string = environment.urlFunctions;

    constructor(private http: HttpClient) { }

    createVideo(data: any): Observable<any> {
        return this.http.post(this.URL_BACKEND, data.video, { responseType: 'json' });
    }

    updateVideo(data: any): Observable<any> {
        return this.http.put(this.URL_BACKEND + '/' + data.video.videoId, data.video,  { responseType: 'json' });
    }

    findAll(): Observable<any> {
        return this.http.get(this.URL_BACKEND, { responseType: 'json' });
    }

    findByCategorie(categorie: string): Observable<any> {
        return this.http.get(this.URL_BACKEND + "/filtre/" + categorie, { responseType: 'json' });
    }

    deleteVideo(data: any): Observable<any> {
        return this.http.delete(this.URL_BACKEND + '/' + data.video.videoId, { responseType: 'json' });
    }

}


