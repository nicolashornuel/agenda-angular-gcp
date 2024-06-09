import { TemplateRef } from '@angular/core';

export interface Modal {
  input: any;
}

export interface ModalParam {
  title: string,
  context: any;
  template: TemplateRef<any>;
}
