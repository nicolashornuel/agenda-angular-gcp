import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { DragDropService } from '@shared/services/drag-drop.service';

@Directive({
  selector: '[appDropZone]'
})
export class DropZoneDirective {
  @Output()
  itemDropped = new EventEmitter<any>();

  private dragCounter = 0;

  @HostBinding('class.drop-zone')
  dropZoneClass = true;

  @HostListener('dragenter', ['$event'])
  dragEnter(event: DragEvent) {
    event.preventDefault();
    this.dragCounter++;
    this.isDragOver = true;
  }

  @HostBinding('class.drag-over')
  isDragOver = false;

  constructor(private dragDrop: DragDropService) {}

  @HostListener('dragover', ['$event'])
  dragOver(event: DragEvent) {
    event.preventDefault();

    this.isDragOver = true;
  }

  @HostListener('dragleave')
  dragLeave() {
    this.dragCounter--;

    if (this.dragCounter === 0) {
      this.isDragOver = false;
    }
  }

  @HostListener('drop', ['$event'])
  drop(event: DragEvent) {
    event.preventDefault();

    this.dragCounter = 0;
    this.isDragOver = false;

    const item = this.dragDrop.getDraggedItem();

    if (item) this.itemDropped.emit(item);

    this.dragDrop.clear();
  }
}
