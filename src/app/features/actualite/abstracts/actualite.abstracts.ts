import { inject, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractFetchFunctionService } from '@core/services/abstractFetchFunction.service';
import { RssService } from '@core/services/rss.service';
import { DestroyService } from '@shared/services/destroy.service';
import { UtilService } from '@shared/services/util.service';
import { FirestoreRssFeedService } from '../services/actualite.firestore.service';
import { ModalService } from '@shared/services/shared.observable.service';
import { RssFeedResolver } from '../services/actualite.resolver.service';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { RssFeed } from '../models/actualite.model';

export abstract class AbstractActualiteService {
  protected utilService = inject(UtilService);
  protected feedRepository = inject(FirestoreRssFeedService);
  protected fetchFunction = inject(AbstractFetchFunctionService);
  protected feedMapper = inject(RssService);
  protected destroy$ = inject(DestroyService);
  protected router = inject(Router);
}

export abstract class AbstractActualiteController {
  protected activatedRoute = inject(ActivatedRoute);
  protected modalService = inject(ModalService);
  protected feedResolver = inject(RssFeedResolver);

  public onOpenModal(title: string, templateRef: TemplateRef<Modal>, t?: RssFeed): void {
    const modalParam: ModalParam<RssFeed> = {
      title,
      context: { $implicit: t },
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }
}