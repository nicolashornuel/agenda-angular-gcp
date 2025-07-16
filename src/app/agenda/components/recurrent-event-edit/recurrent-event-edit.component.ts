import { CalEventField } from '@agenda/models/calEvent.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-recurrent-event-edit',
  templateUrl: './recurrent-event-edit.component.html',
  styleUrls: ['./recurrent-event-edit.component.scss']
})
export class RecurrentEventEditComponent {
  @Input() input!: CalEventField;
  @Output() output = new EventEmitter<CalEventField>();
}
