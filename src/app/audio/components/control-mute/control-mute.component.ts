import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-control-mute',
  templateUrl: './control-mute.component.html',
  styleUrls: ['./control-mute.component.scss']
})
export class ControlMuteComponent {
  @Input() muted = false;
  @Output() mutedChange = new EventEmitter<boolean>();

  constructor() {}

  onClick(): void {
    this.muted = !this.muted;
    this.mutedChange.emit(this.muted);
  }
}
