import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { Position } from 'app/radio/abstracts/audioDirective.abstract';
import { CanvasService } from 'app/radio/services/canvas.service';
import { Subject, Observable, takeUntil } from 'rxjs';

export interface EnvParam {
  attack: number;
  release: number;
  sustain: number;
}

@Component({
  selector: 'app-audio-control-osc',
  templateUrl: './audio-control-osc.component.html',
  styleUrls: ['./audio-control-osc.component.scss']
})
export class AudioControlOscComponent implements AfterViewInit  {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('scalling') scalling!: ElementRef<HTMLCanvasElement>;
  private canvasCtx!: CanvasRenderingContext2D;
  private isMoving = false;

  // ENVELOPPE
  @Input('envParam') envParam: EnvParam = {
      attack: 0.1,
      release: 0.3,
      sustain: 0.9
    }
  @Output() envParamChange = new EventEmitter<EnvParam>();

  private envParam$ = new Subject<any>();
  public get getEnvParam$(): Observable<any> {
    return this.envParam$.asObservable();
  }
  public setEnvParam$(value: any): void {
    this.envParam$.next(value);
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onClick(): void {
    this.isMoving = false;
  }

  private positions!: { attack: Position, release: Position };
  public readonly GEO = {
    w: 200,
    h: 100,
    vw: 180,
    vh: 80,
    mw: 190,
    mh: 90,
    min: 10,
    dia: 5
  }

  constructor(private canvasService: CanvasService, private destroy$: DestroyService) { }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.listen();
    this.setEnvParam$(this.envParam);
  }

  private listen(): void {
    this.getEnvParam$.pipe(takeUntil(this.destroy$)).subscribe((value: EnvParam) => {
      this.positions = this.updatePosition(value, this.GEO);
      this.draw(this.positions);
    });
  }

  private updatePosition(envParam: EnvParam, GEO: any): any {
    const y = GEO.vh - (Math.floor(envParam.sustain * 100) / 100) * GEO.vh;
    const xAttack = (Math.floor(envParam.attack * 100) / 100) * GEO.vw;
    const xRelease = GEO.vw - (Math.floor(envParam.release * 100) / 100) * GEO.vw;
    return {
      attack: { x: xAttack + GEO.min, y: GEO.min },
      release: { x: xRelease + GEO.min, y: y + GEO.min }
    }
  }

  private initCanvas(): void {
    //this.envParam.canvas = this.canvas
    this.canvas.nativeElement.width = this.GEO.w;
    this.canvas.nativeElement.height = this.GEO.h;
    this.canvasCtx = this.canvas.nativeElement.getContext('2d')!;
    let css: CSSStyleDeclaration = getComputedStyle(this.canvas.nativeElement);
    const colorCss = '#00d68f';
    this.canvasCtx.fillStyle = colorCss;
    this.canvasCtx.strokeStyle = '#00d68f';
    this.initScalling(colorCss);
  }

  private initScalling(colorCss: string): void {
    this.scalling.nativeElement.width = this.GEO.w;
    this.scalling.nativeElement.height = this.GEO.h;
    const scallingCtx = this.scalling.nativeElement.getContext('2d')!;
    // axe vertical
    scallingCtx.beginPath();
    scallingCtx.strokeStyle = colorCss;
    scallingCtx.lineWidth = 1;
    for (let i = 0; i < this.GEO.h; i++) {
      if (i % 10 == 0)
        scallingCtx.moveTo(this.GEO.w, i);
      else
        scallingCtx.lineTo(0, i);
    }
    scallingCtx.stroke();
    // axe horizontal
    scallingCtx.beginPath();
    scallingCtx.strokeStyle = colorCss;
    scallingCtx.lineWidth = 1;
    for (let i = 0; i < this.GEO.w; i++) {
      if (i % 10 == 0)
        scallingCtx.moveTo(i, 0);
      else
        scallingCtx.lineTo(i, this.GEO.h);
    }
    scallingCtx.stroke();
  }

  onEventStart(event: MouseEvent): void {
    this.isMoving = true;
    this.onEventMove(event);
  }

  onEventMove(event: MouseEvent): void {
    if (this.isMoving) {
      const { x, y } = this.canvasService.getPositionFromEvent(event, this.canvas);
      if (y > this.positions.attack.y - this.GEO.dia && y < this.positions.attack.y + this.GEO.dia
        && x > this.positions.attack.x - this.GEO.dia && x < this.positions.attack.x + this.GEO.dia) {
        this.positions.attack.x = x;
        this.normalize({ x, y });
      } else if (y > this.positions.release.y - this.GEO.dia && y < this.positions.release.y + this.GEO.dia
        && x > this.positions.release.x - this.GEO.dia && x < this.positions.release.x + this.GEO.dia) {
        this.positions.release = { x, y };
        this.normalize({ x, y });
      }
    }
  }

  private normalize({ x, y }: Position): void {
    if (x <= this.GEO.mw && x >= this.GEO.min && y <= this.GEO.mh && y >= this.GEO.min) {
      this.draw({ attack: this.positions.attack, release: this.positions.release });
      this.updateEnvParam();
    }
  }

  private updateEnvParam(): void {
    this.envParam = {
      attack: (this.positions.attack.x - this.GEO.min) / this.GEO.vw,
      release: 1 - (this.positions.release.x - this.GEO.min) / this.GEO.vw,
      sustain: 1 - (this.positions.release.y - this.GEO.min) / this.GEO.vh
    }
    this.envParamChange.emit(this.envParam);
  }

  private draw({ attack, release }: { attack: Position, release: Position }): void {
    this.canvasService.clearCanvas(this.canvas);
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(this.GEO.min, this.GEO.mh);
    this.canvasCtx.lineTo(attack.x, this.GEO.min);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
    // arc
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(attack.x, this.GEO.min, 3, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(attack.x, this.GEO.min);
    this.canvasCtx.lineTo(release.x, release.y);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
    // arc
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(release.x, release.y, 3, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(release.x, release.y);
    this.canvasCtx.lineTo(this.GEO.mw, this.GEO.mh);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
  }

}