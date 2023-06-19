import {Injectable} from '@angular/core';
import {Auth, authState, idToken, user, signInAnonymously, UserCredential, signInWithPopup, GoogleAuthProvider} from '@angular/fire/auth';
import {StorageService} from './storage.service';
import {AlertService} from '@shared/services/alert.service';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
/*   user$ = user(this.auth);
  authState$ = authState(this.auth);
  idToken$ = idToken(this.auth); */

  private readonly isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly provider = new GoogleAuthProvider();

  constructor(private readonly auth: Auth, private storage: StorageService, private alert: AlertService) {}

  public signInAnonymously(): void {
    signInAnonymously(this.auth).then(
      response => this.goodAccess(response),
      error => this.badAccess(error)
    );
  }

  public signInWithPopup(): void {
    signInWithPopup(this.auth, this.provider).then(
      response => this.goodAccess(response),
      error => this.badAccess(error)
    );
  }

  private goodAccess(user: UserCredential): void {
    this.storage.setLocalItem('user', JSON.stringify(user));
    this.isLoggedIn$.next(true);
    this.alert.success('Authentifié');
  }

  private badAccess(error: any): void {
    this.alert.error(error.message);
  }
}
