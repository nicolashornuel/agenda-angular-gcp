import { Component, HostBinding, Input } from '@angular/core';
import { PlayerState } from 'app/left-bar/models/left-bar.model';

@Component({
  selector: 'app-playing-bar',
  templateUrl: './playing-bar.component.html',
  styleUrls: ['./playing-bar.component.scss']
})
export class PlayingBarComponent {
  @Input() state!: PlayerState;
  public readonly PlayerState = PlayerState;
  @Input() dark = false;
  @HostBinding('class.dark-theme')
  get darkThemeClass(): boolean {
    return this.dark;
  }
}
