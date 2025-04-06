import { ComponentRef } from '@angular/core';

export interface TabParam {
  name: string;
  closable: boolean;
  content?: any;
  link?: string;
  bind?: (componentRef: ComponentRef<any>) => void;
}

export class TabParam {
    constructor(name: string, isClosable: boolean, slug: string) {
        this.name = name,
        this.closable = isClosable,
        this.link = slug
    }
}
