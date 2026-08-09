import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { DragDropService } from '@shared/services/drag-drop.service';

@Directive({
  selector: '[appDragZone]'
})
export class DragZoneDirective {

  @Input('appDragZone') item!: any;

  @HostBinding('class.drag-zone')
  dragZoneClass = true;

  @HostBinding('attr.draggable')
  draggable = true;

  @HostBinding('class.dragging')
  isDragging = false;

  constructor(private dragDrop: DragDropService) {}

  @HostListener('dragstart')
  onDragStart() {
    this.dragDrop.startDrag(this.item);
    this.isDragging = true;
  }

  @HostListener('dragend')
  onDragEnd() {
    this.isDragging = false;
  }
}