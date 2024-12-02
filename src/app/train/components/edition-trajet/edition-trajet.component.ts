import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirestoreStorageService } from '@core/services/firebasestorage.service';
import {
  DataField,
  DataSelect,
  FieldSet
} from '@shared/models/tableSet.interface';
import { ModalService } from '@shared/services/shared.observable.service';
import { ReservationDTO, Train } from 'app/train/models/reservation.model';
import { StopArea } from 'app/train/models/sncf.model';
import { SncfService } from 'app/train/services/sncf.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-edition-trajet',
  templateUrl: './edition-trajet.component.html',
  styleUrls: ['./edition-trajet.component.scss']
})
export class EditionTrajetComponent implements OnInit {
  public startAtField!: FieldSet;
  public startPlaceField!: FieldSet;
  public endAtField!: FieldSet;
  public endPlaceField!: FieldSet;
  public trainNumberField!: FieldSet;
  public seatNumberField!: FieldSet;
  public travelReferencyField!: FieldSet;
  public priceField!: FieldSet;
  public subscriptionCardField!: FieldSet;
  public cancelationField!: FieldSet;
  public fileStorageField!: FieldSet;
  public isRefundedField!: FieldSet;

  @Input() input!: any;
  @Output() output = new EventEmitter<ReservationDTO>();

  public src: string | SafeResourceUrl = '';
  public file?: File;

  constructor(private modalService: ModalService, private firebaseStorage: FirestoreStorageService, private _sanitizer: DomSanitizer, private sncfService: SncfService) {}

  ngOnInit(): void {
    this.input = {
      travelReferency: '',
      fileStorage: '',
      id: '',
      startAt: new Date(),
      endAt: new Date(),
      startPlace: {},
      endPlace: StopArea.BAILLARGUES,
      trainNumber: '',
      seatNumber: '',
      price: 0,
      subscriptionCard: '',
      cancelation: '',
      isRefunded: false,
    };
    /* console.log(this.input); */
    
    this.startAtField = new DataField(Train.START_AT, this.input);
    this.startPlaceField = new DataSelect(Train.START_PLACE, this.input, Object.values(StopArea));
    this.endAtField = new DataField(Train.END_AT, this.input);
    this.endPlaceField = new DataSelect(Train.END_PLACE, this.input, Object.values(StopArea));
    this.trainNumberField = new DataField(Train.TRAIN_NUMBER, this.input);
    this.seatNumberField = new DataField(Train.SEAT_NUMBER, this.input);
    this.travelReferencyField = new DataField(Train.TRAVEL_REF, this.input);
    this.priceField = new DataField(Train.PRICE, this.input);
    this.subscriptionCardField = new DataField(Train.SUBSCRIPTION, this.input);
    this.cancelationField = new DataField(Train.CANCELATION, this.input);
    this.isRefundedField = new DataField(Train.REFUNDED, this.input);
    this.fileStorageField = new DataField(Train.FILE_STORAGE, this.input);
    
  }

  public onSelectChange(selected:  StopArea): void {
    /* this.sncfService.getByRoute(selected.id).pipe(take(1)).subscribe(liste => {
      console.log(liste);
    }) */
    this.sncfService.getByTerminus(selected.id).pipe(take(1)).subscribe(liste => {
      console.log(liste);
    })
  }

  public onClose(): void {
    this.modalService.set$(undefined);
  }

  public async onFileChange(event: any) {
    // on garde en mémoire avant de stocker
    this.file = event.target.files.item(0);

    // on affiche
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.src = this._sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
    });
    if (this.file) reader.readAsDataURL(this.file);
  }

  public onSave(): void {
    console.log(this.startPlaceField);
    console.log(this.input);
    
    //this.output.emit(value);
      //let link = await this.firebaseStorage.uploadToStorage("train/trajets", event.target);
    this.modalService.set$(undefined);
  }
}
