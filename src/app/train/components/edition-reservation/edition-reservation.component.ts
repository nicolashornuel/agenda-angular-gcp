import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reservation } from 'app/train/models/reservation.model';

@Component({
  selector: 'app-edition-reservation',
  templateUrl: './edition-reservation.component.html',
  styleUrls: ['./edition-reservation.component.scss']
})
export class EditionReservationComponent {

  @Input() input!: Reservation;
  @Output() output = new EventEmitter<Reservation>();

}
