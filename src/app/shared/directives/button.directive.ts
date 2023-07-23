import { Directive, HostBinding, Input } from '@angular/core';
import { Appearances, Colors, Sizes } from '@shared/models/button.type';

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective {

  @Input() icon?: string;
  @Input() size: Sizes = 'regular';
  @Input() color: Colors = 'blue';

  private appearance: Appearances = 'filled';
  private _fullWidth: boolean = false;

  @HostBinding('class')
  get additionalClasses() {
    return `color-${this.color} ${this.size}`;
}

  @Input()
  @HostBinding('class.appearance-filled')
  set filled(_value: any) {
    this.appearance = 'filled';
  }
  get filled(): boolean {
    return this.appearance === 'filled';
  }

  @Input()
  @HostBinding('class.appearance-outline')
  set outline(_value: any) {
    this.appearance = 'outline';
  }
  get outline(): boolean {
    return this.appearance === 'outline';
  }

  @Input()
  @HostBinding('class.appearance-ghost')
  set ghost(_value: any) {
    this.appearance = 'ghost';
  }
  get ghost(): boolean {
    return this.appearance === 'ghost';
  }

  @Input()
  @HostBinding('class.fullWidth')
  set fullWidth(_value: any) {
    this._fullWidth = true;
  }
  get fullWidth(): boolean {
    return this._fullWidth;
  }


}
