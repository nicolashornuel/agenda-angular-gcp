import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor() {}

  public sortInByAsc(array: any[], key: string): any[] {
    if (typeof array[0][key] == 'boolean') {
      return array.sort((a, b) => {
        // false values first
        return a[key] === b[key] ? 0 : a[key] ? 1 : -1;
      });
    } else {
      return array.sort((a, b) => {
        if (b[key] > a[key]) {
          return -1;
        } else if (b[key] < a[key]) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

  public sortInByDesc(array: any[], key: string): any[] {
    if (typeof array[0][key] == 'boolean') {
      return array.sort((a, b) => {
        // true values first
        return a[key] === b[key] ? 0 : a[key] ? -1 : 1;
      });
    } else {
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

  public formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: "2-digit",
      minute: "2-digit"
  };
    return date ? date.toLocaleDateString("fr-FR", options) : '';
  }
}
