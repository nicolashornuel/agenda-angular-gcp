import { ElementRef } from "@angular/core";
import { Observable } from "rxjs";

export interface PadControlable {
  isPersist?: boolean;
  padParam: PadParam;
  onPersistChange(event: any): void
}

export interface Position {
  x: number;
  y: number;
}

export const PAD_MAX = 250;

export function normalizeValueFromX(position: number, min: number, max: number): number {
  return Math.ceil((position / PAD_MAX) * 100) / 100;
}
export function normalizeValueFromY(position: number, min: number, max: number): number {
  return Math.ceil(((PAD_MAX - position) / PAD_MAX) * 100) / 100;
}
export function normalizeYFromValue(value: number, min: number, max: number): number {
  return PAD_MAX - (Math.floor(value * 100) / 100) * PAD_MAX;
}

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
