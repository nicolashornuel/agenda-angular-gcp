import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {
  @Input() icon?: string;
  @Input() size?: string;
  @Input() status?: string = 'primary'

  private appearance: 'outline' | 'filled' = 'filled';
  private _fullWidth: boolean = false;

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
  @HostBinding('class.fullWidth')
  set fullWidth(_value: any) {
    this._fullWidth = true;
  }
  get fullWidth(): boolean {
    return this._fullWidth;
  }


}
