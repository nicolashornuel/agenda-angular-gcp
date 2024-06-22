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
      title: 'À faire',
      route: 'memo/todo'
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
      title: 'Trading',
      route: 'trading'
    }
  ]

  constructor(public auth: AuthService) {}
}
