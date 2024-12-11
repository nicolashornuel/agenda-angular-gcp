import {Injectable} from '@angular/core';
import {UserInfo} from '@angular/fire/auth';
import {collectionData, query, where} from '@angular/fire/firestore';
import {AlertService} from '@shared/services/alert.service';
import {KEY_STORAGE_USER} from '@core/services/auth.service';
import {FirestoreService} from '@core/services/firestore.service';
import {StorageService} from '@core/services/storage.service';
import {Observable, map} from 'rxjs';
import { Selectable } from '@shared/models/fieldSet.model';

@Injectable({
  providedIn: 'root'
})
export class AudioSelectParamService extends FirestoreService<AudioSelectParam> {
  constructor(private alertService: AlertService, private storage: StorageService) {
    super('audioSelectParam');
  }

  public findFirstByType(type: AudioParamType): Observable<AudioSelectParam | undefined> {
    const q = query(this.collectionRef, where('type', '==', type));
    return collectionData(q, {idField: 'id'}).pipe(map(res => res.at(0)));
  }

  public async updateOne(audioSelectParam: AudioSelectParam): Promise<void> {
    await this.update(audioSelectParam, audioSelectParam.id!);
    this.alertService.success(`${audioSelectParam.type} modifié`);
  }

  public async createOne(audioSelectParam: AudioSelectParam, type: AudioParamType): Promise<void> {
    audioSelectParam.type = type;
    const userStored: UserInfo | undefined = this.storage.getLocalItem(KEY_STORAGE_USER);
    if (userStored && userStored.uid) audioSelectParam.uid = userStored.uid;
    audioSelectParam.id = await this.save(audioSelectParam);
    this.alertService.success(`${audioSelectParam.type} ajouté`);
  }
}

export declare type AudioParamType = 'radio' | 'equalizer';

export interface AudioSelectParam {
  id?: string;
  list: Selectable<number>[];
  selected: number;
  uid?: string;
  type: AudioParamType;
  updateAt?: Date;
}
