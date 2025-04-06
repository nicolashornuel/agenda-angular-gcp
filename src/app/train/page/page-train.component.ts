import { Component } from '@angular/core';
import { TabParam } from '@shared/models/tabParam.interface';

@Component({
  selector: 'app-page-train',
  templateUrl: './page-train.component.html',
  styleUrls: ['./page-train.component.scss']
})
export class PageTrainComponent {

  public tabs: TabParam[] = [
    {
      name: 'Réservations',
      closable: false,
      link: 'reservations',
    },
    {
      name: 'Départs',
      closable: false,
      link: 'departures',
    },
    {
      name: 'Arrivées',
      closable: false,
      link: 'arrivals',
    }
  ];
  

}
