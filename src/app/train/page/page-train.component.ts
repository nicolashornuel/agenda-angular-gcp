import { Component, TemplateRef } from '@angular/core';
import { Reservation } from '../models/reservation';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { ModalService } from '@shared/services/shared.observable.service';

@Component({
  selector: 'app-page-train',
  templateUrl: './page-train.component.html',
  styleUrls: ['./page-train.component.scss']
})
export class PageTrainComponent {

  constructor(private modalService: ModalService) {}

  onAddReservation(reservation: Reservation) {

  }

  public onOpenModal(templateRef: TemplateRef<Modal>): void {
    const modalParam: ModalParam = {
      title: "Ajouter une réservation",
      context: {$implicit: undefined},
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }

}
