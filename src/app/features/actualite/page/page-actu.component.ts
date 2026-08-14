import { Component, OnInit } from '@angular/core';
import { Resolvable } from '@core/models/resolvable.model';
import { TabParam } from '@shared/models/tabParam.interface';
import { AbstractActualiteController } from '../abstracts/actualite.abstracts';

@Component({
  selector: 'app-page-actu',
  templateUrl: './page-actu.component.html',
  styleUrls: ['./page-actu.component.scss']
})
export class PageActuComponent extends AbstractActualiteController implements OnInit {
  public resolvable!: Resolvable<TabParam[]>;

  ngOnInit(): void {
    this.resolvable = this.feedResolver.resolveTabs(this.activatedRoute);
  }
}
