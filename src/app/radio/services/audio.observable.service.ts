import { Injectable } from '@angular/core';
import { BehaviorSubjectService } from '@shared/abstracts/observable.abstract';
import { StationSelectable, StationsEnum } from '../enums/radioFrance.enum';

@Injectable({
  providedIn: 'root'
})
export class AudioVolumeService extends BehaviorSubjectService<number> {
  constructor() {
    super(0.01);
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
export class SourceAudioService extends BehaviorSubjectService<MediaElementAudioSourceNode | undefined> {
  constructor() {
    super(undefined);
  }
}

@Injectable({
  providedIn: 'root'
})
export class StationRadioService extends BehaviorSubjectService<StationsEnum> {
  constructor() {
    super(StationsEnum.FIP);
  }
}