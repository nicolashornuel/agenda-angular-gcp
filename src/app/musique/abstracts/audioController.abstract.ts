import { AfterViewInit, Component, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { AudioGainService, PersistEffectService } from '../services/audio.service';
import { CanvasService } from '../services/canvas.service';
import { DestroyService } from '@shared/services/destroy.service';

export interface PadParam {
  canvas?: ElementRef<HTMLCanvasElement>;
  libelleX: string;
  libelleY: string;
  isPersist?: boolean;
  subValue$?: Observable<number>;
  currentPosition?: Position;
  updatePosition?(position: Position, value: number): Position;
  onEventStart?(): void;
  onEventMove?(position: Position): void;
  onEventEnd?(): void
}

export interface Position {
  x: number;
  y: number;
}

export const PAD_MAX = 250;

class PadController {
  
  normalizeValueFromX(position: number, min: number, max: number): number {
    return Math.ceil((position / PAD_MAX) * 100) / 100;
  }
  
  normalizeValueFromY(position: number, min: number, max: number): number {
    return Math.ceil(((PAD_MAX - position) / PAD_MAX) * 100) / 100;
  }
  
  normalizeYFromValue(value: number, min: number, max: number): number {
    return PAD_MAX - (Math.floor(value * 100) / 100) * PAD_MAX;
  }
}

@Directive({})
export abstract class AudioNodeDirective extends PadController implements AfterViewInit, OnDestroy {

  @Input('context') audioCtx!: AudioContext;
  @Input('source') audioNode!: GainNode;

  abstract padParam: PadParam;
  abstract initNode(): void;
  abstract connectNode(): void;
  abstract disconnectNode(): void;

  constructor(public gainService: AudioGainService, public canvasService: CanvasService ) {
    super();
  }

  ngAfterViewInit(): void {
    this.initNode();
  }
  
  ngOnDestroy(): void {
    this.disconnectNode();
  }

}

@Component({template: ''})
export abstract class AudioController extends AudioNodeDirective {
}

