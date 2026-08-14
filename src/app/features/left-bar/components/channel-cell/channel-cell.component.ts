import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-channel-cell',
  templateUrl: './channel-cell.component.html',
  styleUrls: ['./channel-cell.component.scss']
})
export class ChannelCellComponent {
  @Input() data!: {
    text: string;
    tooltip?: string;
    action?: () => void;
  };

  onClick(): void {
    this.data.action?.();
  }
}
