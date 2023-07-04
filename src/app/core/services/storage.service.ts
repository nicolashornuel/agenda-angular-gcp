import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  isStorageAvailable() {
    return typeof Storage !== 'undefined';
  }

  setLocalItem(key: string, value: any): boolean {
    if (this.isStorageAvailable() && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  getLocalItem(key: string): any | undefined {
    if (this.isStorageAvailable() && window.localStorage) {
      let value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : undefined;;
    }
    return null;
  }

  removeLocalItem(key: string): boolean {
    if (this.isStorageAvailable() && window.localStorage) {
      window.localStorage.removeItem(key);
      return true;
    }
    return false;
  }

  clearLocalStorage(): boolean {
    if (this.isStorageAvailable() && window.localStorage) {
      window.localStorage.clear();
      return true;
    }
    return false;
  }
}
