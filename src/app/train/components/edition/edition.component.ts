import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FieldSet } from '@shared/models/tableSet.interface';
import { ModalService } from '@shared/services/shared.observable.service';
import { Reservation } from 'app/train/models/reservation';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.scss']
})
export class EditionComponent implements OnInit {

  public startAtField: FieldSet = {
    name: "Date de départ"
  }
  public startPlaceField: FieldSet = {
    name: "Lieu de départ"
  }
  public endAtField: FieldSet = {
    name: "Date d'arrivé"
  }
  public endPlaceField: FieldSet = {
    name: "Lieu d'arrivée"
  }
  public trainNumberField: FieldSet = {
    name: "Train"
  }
  public seatNumberField: FieldSet = {
    name: "Place"
  }
  public travelReferencyField: FieldSet = {
    name: "Référence/Dossier Voyage"
  }
  public priceField: FieldSet = {
    name: "Prix"
  }
  public subscriptionCardField: FieldSet = {
    name: "Abonnement/Réduction"
  }
  public cancelationField: FieldSet = {
    name: "Condition d'annulation"
  }
  public fileLinkField: FieldSet = {
    name: "Fichier"
  }

  @Input() input!: Reservation;
  @Output() output = new EventEmitter<Reservation>();

  constructor(private modalService: ModalService) { }
  
  ngOnInit(): void {
    
  }

  public onClose(): void {
    this.modalService.set$(undefined);
  }

  public onSave(): void {
    //this.output.emit(value);
    this.modalService.set$(undefined);
  }

}
