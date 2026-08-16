import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { TabParam } from '@shared/models/tabParam.interface';
import { ModalService } from '@shared/services/shared.observable.service';
import { RssFeed } from '../models/actualite.model';

@Component({
  selector: 'app-page-actu',
  templateUrl: './page-actu.component.html',
  styleUrls: ['./page-actu.component.scss']
})
export class PageActuComponent implements OnInit {
  protected route = inject(ActivatedRoute);
  protected modalService = inject(ModalService);
  protected router = inject(Router);
  public tabs: TabParam[] = [];

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.tabs = data['tabs'];
      const slug = this.route.firstChild?.snapshot.paramMap.get('slug');
      if (!slug && this.tabs.length > 0) this.router.navigate([this.tabs[0].link], { relativeTo: this.route });
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
