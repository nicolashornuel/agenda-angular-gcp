import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './ui-popover.component.html',
  styleUrls: ['./ui-popover.component.scss']
})
export class PopoverComponent {

  @Input() position!: { top: string; left: string; };
  @Input() template!: TemplateRef<any>;

}
