import { Injectable } from '@angular/core';
import { Reservation } from '../models/reservation';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService  {

  reservations: Reservation[] = [
    {
      id: "R0001",
      travelReferency: "RF7878787",
      fileStorage: {
        name: "HORNUEL Carte_identité.pdf",
        link: "https://firebasestorage.googleapis.com/v0/b/agenda-bf245.firebasestorage.app/o/train%2Ftrajets%2FHORNUEL%20Carte_identite%CC%81.pdf?alt=media&token=f685acea-e58f-445b-9e5f-045df6b76d2a"
      },
      trajets: [
        {
          startAt: new Date(),
          endAt: new Date(),
          startPlace: "BAILLARGUES",
          endPlace: "NIMES",
          trainNumber: "TGV INOUI 5647",
          seatNumber: "voiture 6 Haut - Place 107 - Duo cote à cote",
          price: 37,
          subscriptionCard: "TARIF LIBERTE",
          cancelation: "Echange et remboursement sans frais jusqu'à 30 min après départ. Dès 30 min avant départ, billet échangeable 1 fois max uniquement et annulable, sans recrédit du compteur après échange pour les Max Actif et Max Actif+. Si emprunt d’un autre train, échange obligatoire. La carte Liberté valide et une pièce d’identité officielle pourront être demandées lors du contrôle à bord.",
          isRefunded: false
        },
        {
          startAt: new Date(),
          endAt: new Date(),
          startPlace: "BAILLARGUES",
          endPlace: "NIMES",
          trainNumber: "TGV INOUI 5647",
          seatNumber: "voiture 6 Haut - Place 107 - Duo cote à cote",
          price: 37,
          subscriptionCard: "TARIF LIBERTE",
          cancelation: "Echange et remboursement sans frais jusqu'à 30 min après départ. Dès 30 min avant départ, billet échangeable 1 fois max uniquement et annulable, sans recrédit du compteur après échange pour les Max Actif et Max Actif+. Si emprunt d’un autre train, échange obligatoire. La carte Liberté valide et une pièce d’identité officielle pourront être demandées lors du contrôle à bord.",
          isRefunded: false
        }
      ]
    }
  ]

  constructor() { }

  public getAll(): Observable<Reservation[]> {
    return of(this.reservations);
  }
}
