import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  public clearCanvas(canvas: ElementRef<HTMLCanvasElement>): void {
    const { width, height } = canvas.nativeElement;
    const ctx: CanvasRenderingContext2D | null = canvas.nativeElement.getContext('2d');
    ctx?.clearRect(0, 0, width, height);
  }

  public getPositionFromEvent(event: MouseEvent, canvas: ElementRef<HTMLCanvasElement>): {x: number, y: number} {
    const { x, y } = canvas.nativeElement.getBoundingClientRect();
    return {
      x: event.x - x,
      y: event.y - y
    };
  }
  
}