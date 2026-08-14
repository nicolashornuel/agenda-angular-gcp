import { Injectable } from '@angular/core';
import { UserInfo } from '@angular/fire/auth';
import { collectionData, query, where } from '@angular/fire/firestore';
import { AlertService } from '@shared/services/alert.service';
import { KEY_STORAGE_USER } from '@core/services/auth.service';
import { FirestoreService } from '@core/services/firestore.service';
import { StorageService } from '@core/services/storage.service';
import { Observable, map, of } from 'rxjs';
import { Selectable } from '@shared/models/fieldSet.model';

@Injectable({
  providedIn: 'root'
})
export class AudioEqualizerService extends FirestoreService<EqualizerSelectable> {

  constructor(private alertService: AlertService, private storage: StorageService) {
    super('equalizerSelectable');
  }

  public async updateOne(equalizerSelectable: EqualizerSelectable, id: string): Promise<void> {
    delete equalizerSelectable.isDirty;
    delete equalizerSelectable.id;
    await this.update(equalizerSelectable, id);
    this.alertService.success(`${equalizerSelectable.name} modifié`);
  }

  public async createOne(equalizerSelectable: EqualizerSelectable): Promise<void> {
    const userStored: UserInfo | undefined = this.storage.getLocalItem(KEY_STORAGE_USER);
    if (userStored && userStored.uid) equalizerSelectable.uid = userStored.uid;
    await this.save(equalizerSelectable);
    this.alertService.success(`${equalizerSelectable.name} ajouté`);
  }

  public findAll(): Observable<EqualizerSelectable[]> {
    const userStored: UserInfo | undefined = this.storage.getLocalItem(KEY_STORAGE_USER);
    return userStored && userStored.uid ? this.findByUser(userStored.uid) : of([]);
  }

  public findByUser(uid: string): Observable<EqualizerSelectable[]> {
    const q = query(this.collectionRef, where('uid', '==', uid));
    return collectionData(q, { idField: 'id' }).pipe(map(res => res.map(item => ({ ...item, isDirty: false }))));
  }
}

export interface EqualizerSelectable extends Selectable<number[]> {
  id?: string;
  name: string;
  value: number[];
  uid?: string;
}
