import { EventEmitter, Injectable, TemplateRef } from '@angular/core';
import { SubjectService } from '@shared/abstracts/observable.abstract';

export interface Modal {
  input: any;
}

export interface ModalParam {
  title: string,
  context: any;
  template: TemplateRef<any>;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService extends SubjectService<ModalParam>  {
}