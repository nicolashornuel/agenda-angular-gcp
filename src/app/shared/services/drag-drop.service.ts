import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

  private draggedItem: any = null;

  startDrag(item: any) {
    this.draggedItem = item;
  }

  getDraggedItem<T>(): T | null {
    return this.draggedItem;
  }

  clear() {
    this.draggedItem = null;
  }
}
