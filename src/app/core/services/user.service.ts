import { Injectable } from '@angular/core';
import { AbstractCrudService } from './abstractCrud.service';


@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractCrudService  {

  constructor() {
    super('user');
   }

}


export interface User {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
}
