import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirestoreStorageService } from '@core/services/firebasestorage.service';
import { FileStorage } from '@shared/components/input-file/input-file.component';
import { DataField, DataList, DataSelect, FieldSet } from '@shared/models/tableSet.interface';
import { ModalService } from '@shared/services/shared.observable.service';
import { Reservation, Train, TrajetStatus } from 'app/train/models/reservation.model';
import { StopArea } from 'app/train/models/sncf.model';
import { SncfService } from 'app/train/services/sncf.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-edition-reservation',
  templateUrl: './edition-reservation.component.html',
  styleUrls: ['./edition-reservation.component.scss']
})
export class EditionReservationComponent implements OnInit {
  public startAtField!: FieldSet;
  public startPlaceField!: DataSelect<StopArea>;
  public endAtField!: FieldSet;
  public endPlaceField!: DataSelect<StopArea>;
  public trainNumberField!: DataList;
  public seatNumberField!: FieldSet;
  public travelReferencyField!: FieldSet;
  public priceField!: FieldSet;
  public subscriptionCardField!: DataList;
  public cancelationField!: FieldSet;
  public fileStorageField!: FieldSet;
  public statusField!: DataSelect<TrajetStatus>;

  @Input() input!: Reservation;
  @Output() output = new EventEmitter<Reservation>();

  public src: string | SafeResourceUrl = '';
  public file?: FileStorage;

  constructor(
    private modalService: ModalService,
    private firebaseStorage: FirestoreStorageService,
    private _sanitizer: DomSanitizer,
    private sncfService: SncfService
  ) {}

  ngOnInit(): void {
    this.startAtField = new DataField(Train.START_AT, this.input);
    this.startPlaceField = new DataSelect<StopArea>(Train.START_PLACE, this.input, Object.values(StopArea));
    this.endAtField = new DataField(Train.END_AT, this.input);
    this.endPlaceField = new DataSelect<StopArea>(Train.END_PLACE, this.input, Object.values(StopArea));
    this.trainNumberField = new DataList(Train.TRAIN_NUMBER, this.input, new Set());
    this.seatNumberField = new DataField(Train.SEAT_NUMBER, this.input);
    this.travelReferencyField = new DataField(Train.TRAVEL_REF, this.input);
    this.priceField = new DataField(Train.PRICE, this.input);
    this.subscriptionCardField = new DataList(Train.SUBSCRIPTION, this.input, new Set());
    this.cancelationField = new DataField(Train.CANCELATION, this.input);
    this.statusField = new DataSelect<TrajetStatus>(Train.STATUS, this.input, Object.values(TrajetStatus));
    this.fileStorageField = new DataField(Train.FILE_STORAGE, this.input);
    this.getFile(this.fileStorageField.value as FileStorage);
  }

  public getFile(fileStorage: FileStorage): void {
    if (fileStorage) {
      this.src = this._sanitizer.bypassSecurityTrustResourceUrl(fileStorage.link!);
      this.file = fileStorage;
    }
  }

  public onSelectChange(selected: StopArea): void {
    /* this.sncfService.getByRoute(selected.id).pipe(take(1)).subscribe(liste => {
      console.log(liste);
    }) */
    this.sncfService
      .getByTerminus(selected.value)
      .pipe(take(1))
      .subscribe(liste => {
        console.log(liste);
      });
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
    if (this.file) reader.readAsDataURL(this.file as File);
  }

  public onSave(): void {
    console.log(this.startPlaceField);
    console.log(this.input);

    //this.output.emit(value);
    //let link = await this.firebaseStorage.uploadToStorage("train/trajets", event.target);
    this.modalService.set$(undefined);
  }
}
