import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AbstractHttpService} from 'app/core/services/abstractHttp.service';
import {toDoEntity} from '../models/to-do.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService extends AbstractHttpService<toDoEntity> {
  constructor(http: HttpClient) {
    super(http, 'calendarEvent');
  }
}
