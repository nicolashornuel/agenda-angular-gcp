import { Component } from '@angular/core';
import { ActionSet, CellRenderers, ColumnCustom, ColumnHtml, ColumnSet, ColumnString } from '@shared/models/tableSet.interface';
import { ListeDirective } from 'app/train/abstracts/listeDirective.abstract';
import { Reservation, Train } from 'app/train/models/reservation';

@Component({
  selector: 'app-liste-reservation',
  templateUrl: './liste-reservation.component.html',
  styleUrls: ['./liste-reservation.component.scss']
})
export class ListeReservationComponent extends ListeDirective<Reservation> {

  protected override mapData(reservations: any[]): any[] {
    return reservations.flatMap(reservation =>
      reservation.trajets.map((trajet: any) => ({ ...trajet, ...reservation })))
  }

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnString(Train.TRAVEL_REF, true),
      new ColumnHtml(Train.START_AT, false, CellRenderers.toShortDate()),
      new ColumnString(Train.START_PLACE, false),
      new ColumnHtml(Train.END_AT, false, CellRenderers.toShortDate()),
      new ColumnString(Train.END_PLACE, false),
      new ColumnString(Train.TRAIN_NUMBER, true),
      new ColumnString(Train.SEAT_NUMBER, false),
      new ColumnString(Train.PRICE, true),
      new ColumnString(Train.SUBSCRIPTION, true),
      new ColumnString(Train.CANCELATION, true),
      new ColumnCustom(Train.REFUNDED, true, CellRenderers.toCheckBox())
    ];
  }

  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.EDIT, row => this.onEdit(row)),
      new ActionSet(ActionSet.DELETE, row => this.onDelete(row))
    ]
  }

}
