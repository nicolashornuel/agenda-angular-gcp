import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { Observable, take, takeUntil } from 'rxjs';
import { AudioControlPadComponent } from '../components/audio-control-pad/audio-control-pad.component';
import { AudioNodeAnalyserComponent } from '../components/audio-node-analyser/audio-node-analyser.component';
import { AudioVolumeService, SourceAudioService } from '../services/audio.observable.service';
import { CanvasService } from '../services/canvas.service';

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
  onEventEnd?(): void;
}

export interface Position {
  x: number;
  y: number;
}

export const PAD_MAX = 250;

@Directive({})
export abstract class AudioNodeController {
  @Input('context') audioCtx!: AudioContext;
  @Input() gainNode!: GainNode;
  protected abstract initNode(): void;
  protected abstract connectNode(): void;
  protected sourceService = inject(SourceAudioService);
  public sourceNode!: MediaElementAudioSourceNode;
}

@Directive({})
export abstract class AudioNodeSource extends AudioNodeController implements AfterViewInit {
  ngAfterViewInit(): void {
    this.sourceService.get$.pipe(take(1)).subscribe(source => {
      this.sourceNode = source!;
      this.initNode();
      this.connectNode();
    });
  }
}

@Directive({})
export abstract class AudioNodePad extends AudioNodeController implements OnInit, AfterViewInit, OnDestroy {
  protected abstract padParam: PadParam;
  protected abstract disconnectNode(): void;

  constructor(
    public component: AudioControlPadComponent,
    public volumeService: AudioVolumeService,
    public canvasService: CanvasService,
    public destroy$: DestroyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.component.padParam = this.padParam;
  }

  ngAfterViewInit(): void {
    this.sourceService.get$.pipe(takeUntil(this.destroy$)).subscribe(source => {
      this.sourceNode = source!;
      this.initNode();
    });
  }

  ngOnDestroy(): void {
    this.disconnectNode();
  }

  protected normalizeValueFromX(position: number, min: number, max: number): number {
    const deltaZoom = max - min;
    const positionOnPad = position / PAD_MAX;
    const positionWithZoom = positionOnPad * deltaZoom + min;
    //return Math.ceil((position / PAD_MAX) * 100) / 100;
    return Math.ceil(positionWithZoom * 100) / 100;
  }

  protected normalizeValueFromY(position: number, min: number, max: number): number {
    const deltaZoom = max - min;
    const positionOnPad = (PAD_MAX - position) / PAD_MAX;
    const positionWithZoom = positionOnPad * deltaZoom + min;
    //return Math.ceil(((PAD_MAX - position) / PAD_MAX) * 100) / 100;
    return Math.ceil(positionWithZoom * 100) / 100;
  }

  protected normalizeYFromValue(value: number, min: number, max: number): number {
    return PAD_MAX - (Math.floor(value * 100) / 100) * PAD_MAX;
  }
}

@Directive({})
export abstract class AudioNodeAnalyser extends AudioNodeController implements AfterViewInit {
  protected canvas!: ElementRef<HTMLCanvasElement>;
  protected canvasCtx!: CanvasRenderingContext2D;
  protected analyser!: AnalyserNode;
  protected fillStyle!: string;
  protected strokeStyle!: string;
  private component: AudioNodeAnalyserComponent;

  protected abstract draw(bufferLength: number, dataArray: Uint8Array): void;

  constructor(component: AudioNodeAnalyserComponent, public canvasService: CanvasService) {
    super();
    this.component = component;
  }

  ngAfterViewInit(): void {
    this.initNode();
    this.initCanvas();
    this.connectNode();
  }

  protected initNode(): void {
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.minDecibels = -90; // [-100db-0db]
    this.analyser.maxDecibels = -10; // [-100db-0db]
    this.analyser.smoothingTimeConstant = 0.85; // [0-1]
    this.analyser.fftSize = 128; // [32-32768]
  }

  protected connectNode(): void {
    this.gainNode.connect(this.analyser);
  }

  protected initCanvas(): void {
    this.canvas = this.component.canvas;
    this.canvas.nativeElement.width = PAD_MAX;
    this.canvas.nativeElement.height = PAD_MAX;
    this.canvasCtx = this.canvas.nativeElement.getContext('2d')!;
    const css: CSSStyleDeclaration = getComputedStyle(this.canvas.nativeElement);
    this.strokeStyle = css.getPropertyValue('color');
    this.fillStyle = css.getPropertyValue('background-color');
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.draw(bufferLength, dataArray);
  }
}
