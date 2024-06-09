import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Position } from 'app/radio/abstracts/audioDirective.abstract';

@Component({
  selector: 'app-audio-control-pot',
  templateUrl: './audio-control-pot.component.html',
  styleUrls: ['./audio-control-pot.component.scss']
})
export class AudioControlPotComponent implements AfterViewInit, OnChanges {
  //https://mattbridgeman.github.io/drum-machine/#/
  //https://github.com/MattBridgeman/drum-machine/blob/master/src/less/components/rotator/rotator.less
  //https://github.com/MattBridgeman/drum-machine/blob/master/src/js/components/rotator/rotator.react.jsx
  @Input() name!: string;
  @Input() value!: number;
  @Input() min!: number;
  @Input() max!: number;
  @Input() step!: number;
  @Input() disabled?: boolean;
  @Output() valueChange = new EventEmitter<number>();
  @ViewChild('knob') knob!: ElementRef;
  @ViewChild('absolute') absolute!: ElementRef;

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onEventEnd(): void {
    this.isStarted = false;
  }
  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onEventMove(event: any): void {
    if (this.isStarted) this.setPositionFromEvent(event);
  }

  private isStarted = false;
  private readonly MIN_ROTATION = 31;
  private readonly MAX_ROTATION = 331;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.knob) this.setPositionFromInput();
  }

  ngAfterViewInit(): void {
    this.setPositionFromValue();
  }

  onEventStart(event: MouseEvent): void {
    this.isStarted = true;
    this.setPositionFromEvent(event);
  }

  setPositionFromValue(): void {
    const deltaRotation = this.MAX_ROTATION - this.MIN_ROTATION;
    const deltaValue = this.max - this.min;
    const normalizeValue = this.value - this.min;
    const rotation = (normalizeValue * deltaRotation) / deltaValue;
    this.setPosition(rotation + this.MIN_ROTATION);
  }

  getValueFromRotation(rotation: number): number {
    const deltaRotation = this.MAX_ROTATION - this.MIN_ROTATION;
    const deltaValue = this.max - this.min;
    const normalizeValue = ((rotation - this.MIN_ROTATION) * deltaValue) / deltaRotation;
    const value = this.step < 1 ? normalizeValue : Math.trunc(normalizeValue);
    return this.min < 0 ? value - Math.abs(this.min) : value + Math.abs(this.min);
  }

  setPositionFromInput(): void {
    this.valueChange.emit(this.value);
    this.setPositionFromValue();
  }

  private setPositionFromEvent(e: MouseEvent): void {
    const rotation = this.getRotationFromTouch({x: e.clientX, y: e.clientY});
    this.valueChange.emit(this.getValueFromRotation(rotation));
    this.setPosition(rotation);
  }

  private setPosition(rotation: number): void {
    this.knob.nativeElement.style.transform = 'rotate(' + rotation + 'deg)';
  }

  private getRotationFromTouch({x, y}: Position): number {
    const center = this.getCenter(this.knob);
    const positionFromCenter = {x: x - center.x, y: center.y - y};
    const hypotenuse = this.getHypotenuse(positionFromCenter);
    const angle = this.getAngle(positionFromCenter.x, hypotenuse);
    const angleFromZero = this.getAngleFromZero(angle, positionFromCenter);
    return this.normalize(angleFromZero);
  }

  private getCenter(elementRef: ElementRef): Position {
    const {left, width, top, height} = elementRef.nativeElement.getBoundingClientRect();
    return {x: left + width / 2, y: top + height / 2};
  }

  private getHypotenuse({x, y}: Position): number {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }

  private getAngle(adjacent: number, hypotenuse: number): number {
    const radians = Math.acos(adjacent / hypotenuse);
    return radians * (180 / Math.PI);
  }

  private getAngleFromZero(angle: number, {x, y}: Position): number {
    if (y > 0) {
      return 270 - angle;
    } else if (y < 0 && x > 0) {
      return 270 + angle;
    } else if (y < 0 && x < 0) {
      return angle - 90;
    } else {
      return 0;
    }
  }

  private normalize(angle: number): number {
    if (angle <= this.MIN_ROTATION) return this.MIN_ROTATION;
    else if (angle >= this.MAX_ROTATION) return this.MAX_ROTATION;
    else return angle;
  }
}
