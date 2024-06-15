import { Injectable } from '@angular/core';
import { BehaviorSubjectService, SubjectService } from '@shared/abstracts/observable.abstract';

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
export class SourceAudioService extends BehaviorSubjectService<MediaElementAudioSourceNode | undefined> {
  constructor() {
    super(undefined);
  }
}