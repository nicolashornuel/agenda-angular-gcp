import { TemplateRef } from '@angular/core';

export interface PopoverParam {
  position: {top: string; left: string};
  template: TemplateRef<any>;
}