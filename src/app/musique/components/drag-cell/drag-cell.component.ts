import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-drag-cell',
  templateUrl: './drag-cell.component.html',
  styleUrls: ['./drag-cell.component.scss']
})
export class DragCellComponent {
  @Input() item!: any;
}
