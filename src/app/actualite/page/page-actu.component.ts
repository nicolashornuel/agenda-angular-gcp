import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { TabParam } from '@shared/models/tabParam.interface';
import { ModalService } from '@shared/services/shared.observable.service';
import { switchMap, take } from 'rxjs';
import { RssFeed } from '../models/rss-feed.model';
import { RssFeedResolver } from '../services/rss-feed.resolver';

@Component({
  selector: 'app-page-actu',
  templateUrl: './page-actu.component.html',
  styleUrls: ['./page-actu.component.scss']
})
export class PageActuComponent implements OnInit {
  public tabs: TabParam[] = [];
  public tabSelected = 0;
  public isLoading = false;
  public activatedRoute = inject(ActivatedRoute);
  public modalService = inject(ModalService);
  public feedResolver = inject(RssFeedResolver);

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.paramMap
      .pipe(
        take(1),
        switchMap(() => this.feedResolver.resolveTabs())
      )
      .subscribe(tabs => {
        this.tabs = tabs;
        this.isLoading = false;
      });
  }

  public onOpenModal(title: string, templateRef: TemplateRef<Modal>, t?: RssFeed): void {
    const modalParam: ModalParam<RssFeed> = {
      title,
      context: { $implicit: t },
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }
}
