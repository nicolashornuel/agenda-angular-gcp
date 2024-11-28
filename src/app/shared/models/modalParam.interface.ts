import { TemplateRef } from '@angular/core';

export interface Modal {
  input: any;
}

export interface ModalParam<T> {
  title: string,
  context: { $implicit: T | undefined };
  template: TemplateRef<any>;
  maxWidth?: string;
}
