import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent {

  @Input() title!: string;
  public isOpen = false;

  public onToggleOpen(): void {
    this.isOpen = !this.isOpen;
  }
}
