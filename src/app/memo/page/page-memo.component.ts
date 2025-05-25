import { Component } from '@angular/core';
import { TabParam } from '@shared/models/tabParam.interface';

@Component({
  selector: 'app-page-memo',
  templateUrl: './page-memo.component.html',
  styleUrls: ['./page-memo.component.scss']
})
export class PageMemoComponent {

  public tabs: TabParam[] = [
    {
      name: 'Romane',
      closable: false,
      link: 'romane',
    },
    {
      name: 'Baptiste',
      closable: false,
      link: 'baptiste',
    },
    {
      name: 'Emilie',
      closable: false,
      link: 'emilie',
    },
    {
      name: 'Nicolas',
      closable: false,
      link: 'nicolas',
    },
    {
      name: 'Maison',
      closable: false,
      link: 'maison',
    },
/*     {
      name: 'À faire',
      closable: false,
      link: 'to-do',
    } */
  ];
  

}
