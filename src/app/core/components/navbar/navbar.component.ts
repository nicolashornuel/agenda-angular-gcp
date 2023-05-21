import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

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

}
