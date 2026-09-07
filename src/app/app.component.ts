import { Component, inject, OnInit } from '@angular/core';
import {
  ResolveEnd,
  ResolveStart,
  Router
} from '@angular/router';
import { DestroyService } from '@shared/services/destroy.service';
import { takeUntil } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  protected router = inject(Router);
  protected auth = inject(AuthService);
  protected destroy$ = inject(DestroyService);
  protected loading = false;

  protected items = [
    {
      title: 'Agenda',
      route: 'agenda'
    },
    {
      title: 'Memo',
      route: 'memo'
    },
    {
      title: 'Musique',
      route: 'musique'
    },
    {
      title: 'Actualité',
      route: 'actualite'
    },
        {
      title: 'Train',
      route: 'train'
    },
    {
      title: 'GPS',
      route: 'location'
    },
    {
      title: 'Météo',
      route: 'meteo'
    },
/*     {
      title: 'Trading',
      route: 'trading'
    }, */
  ];

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof ResolveStart) this.loading = true;
      if (event instanceof ResolveEnd) this.loading = false;
    });
  }
}
