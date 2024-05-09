import {Injectable} from '@angular/core';
import { UserInfo } from '@angular/fire/auth';
import { QueryDocumentSnapshot, QueryFieldFilterConstraint, QuerySnapshot, collectionData, getDocs, limit, limitToLast, onSnapshot, query, where } from '@angular/fire/firestore';
import {BehaviorSubjectService} from '@shared/abstracts/observable.abstract';
import {AlertService} from '@shared/services/alert.service';
import {DestroyService} from '@shared/services/destroy.service';
import { KEY_STORAGE_USER } from 'app/core/services/auth.service';
import {FirestoreService} from 'app/core/services/firestore.service';
import { StorageService } from 'app/core/services/storage.service';
import {Observable, lastValueFrom, take, takeUntil} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioVolumeService extends BehaviorSubjectService<number> {
  constructor() {
    super(0.03);
  }
}

@Injectable({
  providedIn: 'root'
})
export class EffectPersistService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AudioPlayingService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AudioSelectParamService extends FirestoreService<AudioSelectParam> {
  constructor(private alertService: AlertService, private storage: StorageService) {
    super('audioSelectParam');
  }
  public findByType(type: AudioParamType): Observable<AudioSelectParam[]> {
    const q = query(this.collectionRef, where("type", "==", type));
    return collectionData(q, { idField: 'id' });
  }

  public async findFirstByType(type: AudioParamType): Promise<AudioSelectParam>  {
    const res: AudioSelectParam[] = await lastValueFrom(this.findByType(type).pipe(take(1)));
    return res.at(0)!;
  }

  public getList(): Promise<any[]> {
    return lastValueFrom(this.getAll().pipe(take(1)));
  }
  
  async updateOne(audioSelectParam: AudioSelectParam): Promise<void> {
    await this.update(audioSelectParam, audioSelectParam.id!)
    this.alertService.success(`${audioSelectParam.type} modifié id:${audioSelectParam.id}`);
  }

  async addOne(audioSelectParam: AudioSelectParam): Promise<void> {
    const userStored: UserInfo | undefined = this.storage.getLocalItem(KEY_STORAGE_USER);
    if (userStored && userStored.uid)
      audioSelectParam.uid = userStored.uid;
    audioSelectParam.id = await this.save(audioSelectParam)
    this.alertService.success(`${audioSelectParam.type} ajouté id:${audioSelectParam.id}`);
  }
}

export declare type AudioParamType = 'radio' | 'equalizer'

export interface SelectParam {
  id?: string,
  name: string,
  value: number[] | string
}
export interface AudioSelectParam {
  id?: string,
  list: SelectParam[],
  selected?: number,
  uid?: string,
  type: AudioParamType
  updateAt?: Date
}