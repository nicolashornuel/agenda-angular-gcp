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
        name: 'Evènements Récurrents',
        closable: false,
        link: 'recurrent-event',
      },
      {
        name: 'A valider',
        closable: false,
        link: 'checkbox-event',
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
