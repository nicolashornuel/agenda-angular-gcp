import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataField, DataFile, DataList, DataSelect, FieldSet } from '@shared/models/fieldSet.model';
import { ModalService } from '@shared/services/shared.observable.service';
import { Reservation, TrajetStatus } from 'app/train/models/reservation.model';
import { StopArea } from 'app/train/models/sncf.model';

@Component({
  selector: 'app-edition-reservation',
  templateUrl: './edition-reservation.component.html',
  styleUrls: ['./edition-reservation.component.scss']
})
export class EditionReservationComponent implements OnInit {
  @Input() input!: Reservation;
  @Output() output = new EventEmitter<Reservation>();

  public startAtField!: FieldSet;
  public startPlaceField!: DataSelect<StopArea>;
  public endAtField!: FieldSet;
  public endPlaceField!: DataSelect<StopArea>;
  public trainNumberField!: DataList;
  public seatNumberField!: FieldSet;
  public travelReferencyField!: FieldSet;
  public priceField!: FieldSet;
  public subscriptionCardField!: FieldSet;
  public cancelationField!: FieldSet;
  public fileStorageField!: DataFile;
  public statusField!: DataSelect<TrajetStatus>;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.startAtField = new DataField(Reservation.START_AT);
    this.startPlaceField = new DataSelect<StopArea>(Reservation.START_PLACE, Object.values(StopArea));
    this.endAtField = new DataField(Reservation.END_AT);
    this.endPlaceField = new DataSelect<StopArea>(Reservation.END_PLACE, Object.values(StopArea));
    this.trainNumberField = new DataList(Reservation.TRAIN_NUMBER, new Set());
    this.seatNumberField = new DataField(Reservation.SEAT_NUMBER);
    this.travelReferencyField = new DataField(Reservation.TRAVEL_REF);
    this.priceField = new DataField(Reservation.PRICE);
    this.subscriptionCardField = new DataField(Reservation.SUBSCRIPTION);
    this.cancelationField = new DataField(Reservation.CANCELATION);
    this.statusField = new DataSelect<TrajetStatus>(
      Reservation.STATUS,
      Object.values(TrajetStatus).sort((status: TrajetStatus) => status.order)
    );    
    this.fileStorageField = new DataFile(Reservation.FILE_STORAGE);
  }

  public onClose(): void {
    this.modalService.set$(undefined);
  }

  public async onSave(): Promise<void> {
    this.output.emit(this.input);
    this.modalService.set$(undefined);
  }
}
