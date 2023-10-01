import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from '../models/user.model';
import {AbstractHttpService} from './abstractHttp.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractHttpService<User> {
  constructor(http: HttpClient) {
    super(http, 'calendarEvent');
  }
}
