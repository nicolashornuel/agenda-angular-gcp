import { Directive, inject, OnInit, TemplateRef } from '@angular/core';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { AlertService } from '@shared/services/alert.service';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/shared.observable.service';
import { Observable } from 'rxjs';

export interface Identifiable {
  id?: string;
}

export class Identifiable {
  public static readonly ID = { key: 'id', name: 'ID' };
}

@Directive({
  selector: '[]'
})
export abstract class AbstractController<T extends Identifiable> implements OnInit {

  public destroy$ = inject(DestroyService);
  public modalService = inject(ModalService);
  public alertService = inject(AlertService);
  public isLoading!: boolean;
  public data: T[] = [];

  protected abstract get data$(): Observable<T[]>;
  protected abstract initComponent(): void;
  
  ngOnInit(): void {
    this.isLoading = true;
    this.data$.subscribe((t: T[]) => {
      this.data = t;
      this.initComponent();
      this.isLoading = false;
    });
  }

  public onOpenModal(title: string, templateRef: TemplateRef<Modal>, t?: T): void {
    const modalParam: ModalParam<T> = {
      title,
      context: { $implicit: t },
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }

}
