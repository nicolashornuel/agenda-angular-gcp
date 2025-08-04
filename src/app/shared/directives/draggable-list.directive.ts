import { Directive, HostBinding, HostListener, Input } from '@angular/core';

export interface DraggableListConfig {
  items: any[];
  index: number;
  save?: (items: any[]) => void;
}

@Directive({
  selector: '[appDraggableList]'
})
export class DraggableListDirective {
  @HostBinding('class.article-draggable') articleDraggableClass = true;
@HostBinding('attr.draggable') draggable = true;
  @HostBinding('class.dragging') isDragging = false;
  @HostBinding('class.drag-over') isDragOver = false;

  @Input('appDraggableList') config!: DraggableListConfig;

  private get items() {
    return this.config?.items;
  }

  private get index() {
    return this.config?.index;
  }

  private get saveFn() {
    return this.config?.save;
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    this.isDragging = true;
    event.dataTransfer?.setData('text/plain', String(this.index));
    event.dataTransfer!.effectAllowed = 'move';
  }

  @HostListener('dragend')
  onDragEnd() {
    this.isDragging = false;
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
    event.dataTransfer!.dropEffect = 'move';
  }

  @HostListener('dragleave')
  onDragLeave() {
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const fromIndex = Number(event.dataTransfer?.getData('text/plain'));
    const toIndex = this.index;

    if (isNaN(fromIndex) || fromIndex === toIndex) return;

    const movedItem = this.items.splice(fromIndex, 1)[0];
    this.items.splice(toIndex, 0, movedItem);

    // Appelle le callback de sauvegarde s'il existe
    if (this.saveFn) {
      this.saveFn(this.items);
    }
  }

}
