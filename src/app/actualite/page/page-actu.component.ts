import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { TabParam } from '@shared/models/tabParam.interface';
import { ModalService } from '@shared/services/shared.observable.service';
import { RssFeed } from '../models/rss-feed.model';
import { Resolvable, RssFeedResolver } from '../services/rss-feed.resolver';

@Component({
  selector: 'app-page-actu',
  templateUrl: './page-actu.component.html',
  styleUrls: ['./page-actu.component.scss']
})
export class PageActuComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private modalService = inject(ModalService);
  private feedResolver = inject(RssFeedResolver);
  public resolvable!: Resolvable<TabParam[]>;

  ngOnInit(): void {
    this.resolvable = this.feedResolver.resolveTabs(this.activatedRoute);
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
