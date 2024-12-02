import { Component } from '@angular/core';
import { ActionSet, CellRenderers, ColumnCustom, ColumnHtml, ColumnSet, ColumnString } from '@shared/models/tableSet.interface';
import { ListeController } from 'app/train/abstracts/listeController.abstract';
import { Reservation, Train } from 'app/train/models/reservation.model';

@Component({
  selector: 'app-liste-reservation',
  templateUrl: './liste-reservation.component.html',
  styleUrls: ['./liste-reservation.component.scss']
})
export class ListeReservationComponent extends ListeController<Reservation> {
  protected override initData(): void {
    throw new Error('Method not implemented.');
  }
  public override onCreate(): void {
    throw new Error('Method not implemented.');
  }
  public override onSave(t: Reservation): void {
    throw new Error('Method not implemented.');
  }
  public override onEdit(row: Reservation): void {
    throw new Error('Method not implemented.');
  }
  public override onDelete(row: Reservation): void {
    throw new Error('Method not implemented.');
  }

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
