import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  private isDragging = false;
  private startX = 0;
  private originalLeft = 0;
  private minX = 0;
  private maxX = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'ew-resize');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX;

    const rect = this.el.nativeElement.getBoundingClientRect();
    this.originalLeft = rect.left;

    // Calcul des bornes en fonction du parent
    const parentRect = this.el.nativeElement.parentElement.getBoundingClientRect();

    this.minX = parentRect.left;
    this.maxX = parentRect.right - rect.width;

    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    let newLeft = this.originalLeft + (event.clientX - this.startX);
    
    // Clamp entre minX et maxX
    newLeft = Math.min(this.minX, Math.max(newLeft, this.maxX)) - this.minX;
    
    this.renderer.setStyle(this.el.nativeElement, 'left', `${newLeft}px`);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
  }
}