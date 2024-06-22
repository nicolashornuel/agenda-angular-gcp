import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@shared/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  public isLoading: boolean = false;
  public isLoggedIn$!: Observable<boolean>;

  constructor(
    private readonly auth: AuthService,
    private readonly alert: AlertService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.checkUserStatus();
  }

  private checkUserStatus(): void {
    this.auth.getUserLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.alert.success('Login');
        this.router.navigate(['/agenda']);
      }
    });
  }

  public async loginWithGoogle(): Promise<void> {
    this.isLoading = true;
    await this.auth.signInWithPopup();
    this.isLoading = false;
  }

}
