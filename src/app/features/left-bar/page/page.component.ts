import { Component, inject } from '@angular/core';
import { SidebarIsOpenedService } from '../services/left-bar.observable.service';
import { SidebarConfig } from '@shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {  
  public sidebarConfig: SidebarConfig = {
    width: "710px",
    isOpenedService: inject(SidebarIsOpenedService),
    color: "red",
    position: "left"
  }
}
