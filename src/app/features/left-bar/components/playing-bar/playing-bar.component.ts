import { Component, HostBinding, Input } from '@angular/core';
import { PlayerState } from '@core/services/youtube-player.service';

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
