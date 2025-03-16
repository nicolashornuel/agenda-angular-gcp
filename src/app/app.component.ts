import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {

  public items = [
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
    }
  /*   {
      title: 'Trading',
      route: 'trading'
    }, */
  ]

  constructor(public auth: AuthService) {}
}
