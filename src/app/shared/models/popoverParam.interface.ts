import { TemplateRef } from '@angular/core';

export interface PopoverParam {
  position: {top: string; left: string};
  classPosition: string;
  template: TemplateRef<any>;
}