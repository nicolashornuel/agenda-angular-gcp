import { Component, OnInit } from '@angular/core';
import { BadgeLinkComponent } from '@shared/components/badge-link/badge-link.component';
import { Colors } from '@shared/models/button.type';
import { ActionSet, CellRenderers, ColumnCustom, ColumnHtml, ColumnSet, ColumnString } from '@shared/models/tableSet.interface';
import { ListeController } from 'app/train/abstracts/listeController.abstract';
import { Reservation, Train } from 'app/train/models/reservation.model';
import { StopArea } from 'app/train/models/sncf.model';
import { ReservationService } from 'app/train/services/reservation.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-liste-reservation',
  templateUrl: './liste-reservation.component.html',
  styleUrls: ['./liste-reservation.component.scss']
})
export class ListeReservationComponent extends ListeController<Reservation> implements OnInit {

  constructor(private reservationService: ReservationService) {
    super();
  }
  
  protected override initData(): void {
    this.isLoading = true;
    this.reservationService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reservations: Reservation[]) => {
        this.tableSet.data = reservations;
        this.isLoading = false;
      });
  }
    
    protected override getColumnSet(): ColumnSet[] {
      return [
        new ColumnHtml(Train.START_AT, true, CellRenderers.toShortDate()),
        new ColumnCustom(Train.START_PLACE, true, this.toMiniBadgeLink('blue', '/train/departures/')),
        new ColumnHtml(Train.END_AT, true, CellRenderers.toShortDate()),
        new ColumnCustom(Train.END_PLACE, true, this.toMiniBadgeLink('green', '/train/arrivals/')),
        new ColumnString(Train.TRAIN_NUMBER, true),
        new ColumnString(Train.SEAT_NUMBER, true),
        new ColumnString(Train.PRICE, false),
        new ColumnString(Train.SUBSCRIPTION, false),
        new ColumnString(Train.CANCELATION, false),
        new ColumnCustom(Train.TRAVEL_REF, true, CellRenderers.toBadgeLink()),
        new ColumnCustom(Train.STATUS, false, CellRenderers.toSimpleBadge())
      ];
    }
    
    protected override getActionSet(): ActionSet[] {
      return [
        new ActionSet(ActionSet.EDIT, row => this.onEdit(row)),
        new ActionSet(ActionSet.DELETE, row => this.onDelete(row))
      ]
    }

    public onCreate(): void {
      this.onOpenModal('Créer une réservation', new Reservation())
    }

    public onEdit(row: Reservation): void {
      this.onOpenModal('Editer une réservation', row);
    }

    public onDelete(row: Reservation): void {}

    public async onSave(row: Reservation): Promise<void> {}

    public toMiniBadgeLink(color: Colors, prefix: string) {
      return {
        component: BadgeLinkComponent,
        valuePrepare: (row: any, col: ColumnSet) => ({
          text: (row[col.key] as StopArea).name,
          link: prefix + (row[col.key] as StopArea).value,
          color
        })
      };
    }


}

