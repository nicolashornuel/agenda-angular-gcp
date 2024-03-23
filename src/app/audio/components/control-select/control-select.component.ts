import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-control-select',
  templateUrl: './control-select.component.html',
  styleUrls: ['./control-select.component.scss']
})
export class ControlSelectComponent {
  @Input() items!: string[];
  @Input() selected!: string;
  @Output() selectedChange = new EventEmitter<string>();
}
