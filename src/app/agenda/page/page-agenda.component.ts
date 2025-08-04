import { Component } from '@angular/core';
import { TabParam } from '@shared/models/tabParam.interface';

@Component({
  selector: 'app-page-agenda',
  templateUrl: './page-agenda.component.html',
  styleUrls: ['./page-agenda.component.scss']
})
export class PageAgendaComponent {

    public tabs: TabParam[] = [
           {
        name: 'Mon Calendrier',
        closable: false,
        link: 'calendar',
      },
      {
        name: 'A Valider',
        closable: false,
        link: 'checkbox',
      },
      {
        name: 'Anniversaires',
        closable: false,
        link: 'birthday',
      },
      {
        name: 'Evènements',
        closable: false,
        link: 'event',
      }
    ];

}
