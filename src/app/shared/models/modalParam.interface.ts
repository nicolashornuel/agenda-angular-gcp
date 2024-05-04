import { EventEmitter } from '@angular/core';

export interface Modal {
  input: any;
  output: EventEmitter<any>;
}

import { TemplateRef } from '@angular/core';

export interface ModalParam {
  title: string,
  context: any;
  template: TemplateRef<any>;
}