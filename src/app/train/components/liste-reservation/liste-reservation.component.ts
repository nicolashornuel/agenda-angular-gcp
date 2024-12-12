import { Component, OnInit } from '@angular/core';
import { FirestoreStorageService } from '@core/services/firebasestorage.service';
import { Color } from '@shared/models/color.enum';
import {
  ActionSet,
  CellRenderers,
  ColumnCustom,
  ColumnHtml,
  ColumnSet,
  ColumnString
} from '@shared/models/tableSet.interface';
import { ColSorted } from '@shared/services/columnsortable.service';
import { ListeController } from 'app/train/abstracts/listeController.abstract';
import { Reservation, TrajetStatus } from 'app/train/models/reservation.model';
import { ReservationService } from 'app/train/services/reservation.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-liste-reservation',
  templateUrl: './liste-reservation.component.html',
  styleUrls: ['./liste-reservation.component.scss']
})
export class ListeReservationComponent extends ListeController<Reservation> implements OnInit {
  constructor(private reservationService: ReservationService, private firebaseStorage: FirestoreStorageService) {
    super();
  }

  protected override initData(): void {
    this.isLoading = true;
    this.reservationService
      .getWhereByOrder(Reservation.STATUS.key, TrajetStatus.WAITING, Reservation.START_AT.key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((reservations: Reservation[]) => {
        this.tableSet.data = reservations;
        this.isLoading = false;
      });
  }

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnHtml(Reservation.START_AT, true, CellRenderers.toShortDate()),
      new ColumnCustom(
        Reservation.START_PLACE,
        true,
        CellRenderers.toBadgeLink(Color.BLUE, '/train/departures/', 'Les prochains départs')
      ),
      new ColumnHtml(Reservation.END_AT, true, CellRenderers.toShortDate()),
      new ColumnCustom(
        Reservation.END_PLACE,
        true,
        CellRenderers.toBadgeLink(Color.GREEN, '/train/arrivals/', 'Les prochaines arrivées')
      ),
      new ColumnString(Reservation.TRAIN_NUMBER, true),
      new ColumnCustom(Reservation.STATUS, true, CellRenderers.toSimpleBadge()),
      new ColumnString(Reservation.TRAVEL_REF, false),
      new ColumnHtml(Reservation.PRICE, false, CellRenderers.toDevise('€')),
      new ColumnHtml(Reservation.SUBSCRIPTION, false, CellRenderers.toBoolean()),
      new ColumnString(Reservation.CANCELATION, false),
      new ColumnString(Reservation.SEAT_NUMBER, false)
    ];
  }

  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.EDIT, row => this.onOpenModal('Editer une réservation', row)),
      new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm('Supprimer une réservation', row))
    ];
  }

  public onCreate(): void {
    this.onOpenModal('Créer une réservation', new Reservation());
  }

  public onConfirmDelete(row: Reservation) {
    this.reservationService.delete(row.id!);
    this.modalService.set$(undefined);
    this.alertService.success('suppression réussie');
  }

  public async onSave(row: Reservation): Promise<void> {
    await this.firebaseStorage.storeFile('trainReservation', row.fileStorage!);
    row.endAt = row.endAt.toString();
    row.startAt = row.startAt.toString();
    row.fileStorage = { ...row.fileStorage! };
    await this.reservationService.saveOrUpdate(row);
    this.alertService.success('sauvegarde réussie');
  }

  public filter(value: boolean): void {
  }
}
