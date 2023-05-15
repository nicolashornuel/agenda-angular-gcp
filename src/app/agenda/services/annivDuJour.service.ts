import { Injectable } from '@angular/core';
import { annivDuJour } from '../models/annivDuJour.constant';
import { CalEventField } from '../models/calEvent.model';

@Injectable({
  providedIn: 'root'
})
export class AnnivDuJourService {

  constructor() { }

  public getWithDate(date: Date): string[] {
    //return this.getEphemeris(date.getDate(), date.getMonth() + 1);
    annivDuJour.forEach( (anniv: CalEventField) => {
      let date = anniv.meta!.start!.split('/');
      console.log(anniv.title);
      console.log(new Date(date[0] as unknown as number, date[1] as unknown as number));
      
    })
    return [];
  }
}
