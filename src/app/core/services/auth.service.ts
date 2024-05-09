import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  UserCredential,
  UserInfo,
  signInWithPopup,
  signOut
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertService } from '@shared/services/alert.service';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

export const KEY_STORAGE_USER = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /*   user$ = user(this.auth);
  authState$ = authState(this.auth);
  idToken$ = idToken(this.auth); */

  private readonly isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn = false;
  private readonly provider = new GoogleAuthProvider();

  constructor(
    private readonly auth: Auth,
    private storage: StorageService,
    private alert: AlertService,
    private router: Router,
    private userService: UserService
  ) {}

  public get getUserLoggedIn$(): Observable<boolean> {
    const userStored: UserInfo | undefined = this.storage.getLocalItem(KEY_STORAGE_USER);
    this.isLoggedIn = userStored && userStored.uid ? true : false;
    return userStored && userStored.uid ? of(true) : this.isLoggedIn$.asObservable();
  }

  public signInWithPopup(): Promise<void> {
    return signInWithPopup(this.auth, this.provider).then(
      response => this.goodAccess(response),
      error => this.badAccess(error)
    );
  }

  public signOut(): Promise<void> {
    return signOut(this.auth).then(
      _response => {
        this.storage.removeLocalItem(KEY_STORAGE_USER);
        this.isLoggedIn$.next(false);
        this.router.navigate(['/sign-in']);
      },
      error => this.badAccess(error)
    );
  }

  private async goodAccess(user: UserCredential): Promise<void> {
    //const userInfo: UserInfo = await this.userService.saveOne(user);
    const exist = await this.checkUser(user.user.uid);
    if (exist) {
      this.storage.setLocalItem(KEY_STORAGE_USER, user.user);
      this.isLoggedIn$.next(true);
      this.alert.success('Authentifié');
      this.router.navigate(['/agenda']);
    } else {
      this.isLoggedIn$.next(false);
      this.alert.warning('Non autorisé');
    }
  }

  private badAccess(error: any): void {
    this.alert.error(error.message);
  }

  private async checkUser(uid: string): Promise<boolean> {
    const userSaved = await this.userService.getOne(uid);
    return userSaved ? true : false;
  }
}
