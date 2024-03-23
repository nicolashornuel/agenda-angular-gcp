import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './ui-toggle.component.html',
  styleUrls: ['./ui-toggle.component.scss']
})
export class UiToggleComponent {

  @Input() value!: boolean;
  @Output() valueChange = new EventEmitter<boolean>();
  @Input() rotate?: number = 0;
  @Input() mono?: boolean = false;
  @Input() label?: string;

}
