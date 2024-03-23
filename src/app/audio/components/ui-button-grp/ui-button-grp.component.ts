import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ui-button-grp',
  templateUrl: './ui-button-grp.component.html',
  styleUrls: ['./ui-button-grp.component.scss']
})
export class UiButtonGrpComponent {

  @Input() items!: any[];
  @Input() icon!: boolean;
  @Input() selected!: any;
  @Output() selectedChange = new EventEmitter<any>();

  onClick(item: any) {
    if (item != this.selected) {
      this.selected = item;
      this.selectedChange.emit(item);
    }
  }

}
