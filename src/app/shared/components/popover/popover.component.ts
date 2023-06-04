import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent {

  @Input() position!: { top: string; left: string; };
  @Input() template!: TemplateRef<any>;

}
