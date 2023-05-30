import { Component } from '@angular/core';

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

}
