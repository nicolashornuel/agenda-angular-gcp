import { ElementRef, Injectable } from '@angular/core';
import { Position } from '../interfaces/padControlCanvas.interface';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  constructor() { }

  public clearCanvas(canvas: ElementRef<HTMLCanvasElement>): void {
    const { width, height } = canvas.nativeElement;
    const ctx: CanvasRenderingContext2D | null = canvas.nativeElement.getContext('2d');
    ctx?.clearRect(0, 0, width, height);
  }

  public getPositionFromEvent(event: MouseEvent, canvas: ElementRef<HTMLCanvasElement>): Position {
    const { x, y } = canvas.nativeElement.getBoundingClientRect();
    return {
      x: event.x - x,
      y: event.y - y
    };
  }

}
