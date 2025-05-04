import { ComponentRef } from '@angular/core';

export interface TabParam {
  name: string;
  closable: boolean;
  content?: any;
  link?: string;
  bind?: (componentRef: ComponentRef<any>) => void;
  queryParams?: { [key: string]: string };
}

export class TabParam {
    constructor(name: string, isClosable: boolean, link: string, queryParams?: { [key: string]: string }) {
        this.queryParams = queryParams,
        this.name = name,
        this.closable = isClosable,
        this.link = link
    }
}
