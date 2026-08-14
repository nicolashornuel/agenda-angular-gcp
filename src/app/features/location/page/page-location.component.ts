import { Component } from '@angular/core';
import { TabParam } from '@shared/models/tabParam.interface';

@Component({
  selector: 'app-page-location',
  templateUrl: './page-location.component.html',
  styleUrls: ['./page-location.component.scss']
})
export class PageLocationComponent {
  
  public tabs: TabParam[] = [
           {
        name: 'Carte Géographique',
        closable: false,
        link: 'map',
      },
      {
        name: 'Liste des positions',
        closable: false,
        link: 'list',
      }
    ];

}
