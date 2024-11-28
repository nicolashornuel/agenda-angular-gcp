import { Component } from '@angular/core';
import { TabParam } from '@shared/components/tabs/tabs.component';

@Component({
  selector: 'app-page-train',
  templateUrl: './page-train.component.html',
  styleUrls: ['./page-train.component.scss']
})
export class PageTrainComponent {

  public tabs: TabParam[] = [
    {
      name: 'Trajets',
      closable: false,
      link: 'trajets',
    },
    {
      name: 'Réservations',
      closable: false,
      link: 'reservations',
    },
    {
      name: 'Prochains',
      closable: false,
      link: 'nexts',
    }
  ];
  

}
