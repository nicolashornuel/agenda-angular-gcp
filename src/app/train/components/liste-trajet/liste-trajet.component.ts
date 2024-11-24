import { Component, OnInit } from '@angular/core';
import {
  ActionSet,
  CellRenderers,
  ColumnCustom,
  ColumnHtml,
  ColumnSet,
  ColumnString
} from '@shared/models/tableSet.interface';
import { ListeDirective } from 'app/train/abstracts/listeDirective.abstract';
import { Reservation, Train } from 'app/train/models/reservation';

@Component({
  selector: 'app-liste-trajet',
  templateUrl: './liste-trajet.component.html',
  styleUrls: ['./liste-trajet.component.scss']
})
export class ListeTrajetComponent extends ListeDirective<Reservation> implements OnInit {
  
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


}
