import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public sortInByAsc(array: any[], key: string): any[] {
    return array.sort((a, b) => {
      if (b[key] > a[key]) {
        return -1;
      } else if (b[key] < a[key]) {
        return 1;
      } else {
        return 0;
      }
    })
  }

  public sortInByDesc(array: any[], key: string): any[] {
    return array.sort((a, b) => {
      if (b[key] < a[key]) {
        return -1;
      } else if (b[key] > a[key]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

}
