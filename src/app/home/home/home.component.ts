import { Component } from '@angular/core';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

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
      title: 'Course',
      route: 'memo/courses'
    }
  ]

  constructor(public auth: AuthService) {}

  public signOut(): void {
    this.auth.signOut();
  }

}
