import { Component, OnInit } from '@angular/core';
import {
  ActionSet,
  CellRenderers,
  ColumnCustom,
  ColumnHtml,
  ColumnSet,
  ColumnString
} from '@shared/models/tableSet.interface';
import { ListeController } from 'app/train/abstracts/listeController.abstract';
import { ReservationDTO, Train } from 'app/train/models/reservation';
import { ReservationService } from 'app/train/services/reservation.service';
import { STATIONS, SncfService } from 'app/train/services/sncf.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-liste-trajet',
  templateUrl: './liste-trajet.component.html',
  styleUrls: ['./liste-trajet.component.scss']
})
export class ListeTrajetComponent extends ListeController<ReservationDTO> implements OnInit {

  constructor(private reservationService: ReservationService) {
    super();
  }
  
  protected override initData(): void {
    this.isLoading = true;
    this.reservationService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((t: any[]) => {
        this.tableSet.data = this.mapData(t);
        this.isLoading = false;
      });
  }
  
  protected override mapData(reservations: any[]): any[] {
    return reservations.flatMap(reservation =>
      reservation.trajets.map((trajet: any) => ({ ...trajet, ...reservation })))
    }
    
    protected override getColumnSet(): ColumnSet[] {
      return [
        new ColumnHtml(Train.START_AT, true, CellRenderers.toShortDate()),
        new ColumnString(Train.START_PLACE, true),
        new ColumnHtml(Train.END_AT, true, CellRenderers.toShortDate()),
        new ColumnString(Train.END_PLACE, true),
        new ColumnString(Train.TRAIN_NUMBER, true),
        new ColumnString(Train.SEAT_NUMBER, true),
        new ColumnString(Train.PRICE, false),
        new ColumnString(Train.SUBSCRIPTION, false),
        new ColumnString(Train.CANCELATION, false),
        new ColumnCustom(Train.TRAVEL_REF, true, CellRenderers.toBadgeLink()),
        new ColumnCustom(Train.REFUNDED, false, CellRenderers.toCheckBox())
      ];
    }
    
    protected override getActionSet(): ActionSet[] {
      return [
        new ActionSet(ActionSet.EDIT, row => this.onEdit(row)),
        new ActionSet(ActionSet.DELETE, row => this.onDelete(row))
      ]
    }

    public onCreate(): void {
      this.onOpenModal('Créer une réservation', new ReservationDTO())
    }

    public onEdit(row: ReservationDTO): void {
      this.onOpenModal('Editer une réservation', row);
    }

    public onDelete(row: ReservationDTO): void {}

    public async onSave(row: ReservationDTO): Promise<void> {}


}
