import { Injectable } from '@angular/core';
import { BehaviorSubjectService } from '@shared/abstracts/observable.abstract';
import { StationsEnum } from '../enums/radioFrance.enum';

@Injectable()
export class AudioVolumeService extends BehaviorSubjectService<number> {
  constructor() {
    super(0.01);
  }
}

@Injectable()
export class EffectPersistService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}

@Injectable()
export class SourceAudioService extends BehaviorSubjectService<MediaElementAudioSourceNode | undefined> {
  constructor() {
    super(undefined);
  }
}

@Injectable()
export class StationRadioService extends BehaviorSubjectService<StationsEnum> {
  constructor() {
    super(StationsEnum.FIP);
  }
}

@Injectable()
export class RadioPlayingService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}