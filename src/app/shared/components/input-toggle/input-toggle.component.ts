import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-toggle',
  templateUrl: './input-toggle.component.html',
  styleUrls: ['./input-toggle.component.scss']
})
export class InputToggleComponent {

  @Input() value!: boolean;
  @Output() valueChange = new EventEmitter<boolean>();
  @Input() rotate?: number = 0;
  @Input() mono?: boolean = false;
  /* @Input() label?: string; */
  @Input() labels?: { true?: string, false?: string };

}
