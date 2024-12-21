import { Injectable } from '@angular/core';
import { BehaviorSubjectService, SubjectService } from '@shared/abstracts/observable.abstract';
import { ModalParam } from '@shared/models/modalParam.interface';
import { PopoverParam } from '@shared/models/popoverParam.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalService extends SubjectService<ModalParam<any>> {}

@Injectable({
  providedIn: 'root'
})
export class PopoverService extends SubjectService<PopoverParam> {}

@Injectable({
  providedIn: 'root'
})
export class IsMobileService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ViewPortService extends BehaviorSubjectService<number> {
  constructor() {
    super(window.innerWidth)
  }
}

@Injectable({
  providedIn: 'root'
})
export class RightBarIsOpenedService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}