import { Injectable } from '@angular/core';
import { getFunctions, httpsCallable } from "firebase/functions";

export interface User {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private functions = getFunctions();

  constructor() { }

  public async getOne(uid: string): Promise<any> {
    const onCallFunction = httpsCallable(this.functions, 'onCallGetOneUser');
    return onCallFunction(uid);
  }

}
