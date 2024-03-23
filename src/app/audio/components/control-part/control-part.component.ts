import { AfterViewInit, Component, Input } from '@angular/core';
import { AbstractBpmComponent } from '../../abstracts/abstract-bpm.component';

@Component({
  selector: 'app-control-part',
  templateUrl: './control-part.component.html',
  styleUrls: ['./control-part.component.scss']
})
export class ControlPartComponent extends AbstractBpmComponent implements AfterViewInit {
  @Input() sequence!: number[];
  public part: any[] = [];

  ngAfterViewInit(): void {
    this.initSequence();
  }

  public onSequenceChange({ checked, index }: { checked: boolean; index: number }): void {
    if (checked) {
      this.sequence.push(index);
      this.sequence.sort((a, b) => a - b);
    } else {
      const position = this.sequence.findIndex(number => number === index);
      this.sequence.splice(position, 1);
    }
  }

  private initSequence(): void {
    this.part = [...Array(16).keys()].map(index => ({ index, checked: this.sequence.includes(index) }));
  }
}
