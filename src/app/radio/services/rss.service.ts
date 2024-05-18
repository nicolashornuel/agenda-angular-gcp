import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RssService {

  constructor(private http: HttpClient) { }

  public getRSSFeedData(url: string): Observable<any> {
    const requestOptions: object = {
      responseType: 'text'
    };
    return this.http.get<any>(url, requestOptions);
  }

  public parseXML(data: any): any {
    var parser = new DOMParser();
    return  parser.parseFromString(data, "application/xml");
  }

  public parseHTML(data: any): any {
    var parser = new DOMParser();
    return  parser.parseFromString(data, "text/html");
  }


}
