import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() items: {
    title: string;
    route: string;
  }[] = [];
  @Output() signOut = new EventEmitter<void>();
  
}
