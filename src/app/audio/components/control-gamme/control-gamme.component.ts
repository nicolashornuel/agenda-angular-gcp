import { AfterViewInit, Component, Input } from '@angular/core';
import { AbstractBpmComponent } from '../../abstracts/abstract-bpm.component';
import { Note, gamme } from '../../models/gamme.constant';

@Component({
  selector: 'app-control-gamme',
  templateUrl: './control-gamme.component.html',
  styleUrls: ['./control-gamme.component.scss']
})
export class ControlGammeComponent extends AbstractBpmComponent implements AfterViewInit {

  @Input() sequence!: {[key: string]: string[]};
  public part: any[] = [];

  ngAfterViewInit(): void {
    this.initSequence();
  }

  public onSequenceChange(value: Note, i: number): void {
    if (value.checked) { 
      const note: Note = Object.values(gamme).find(gamme => gamme.label === value.label)!;
      this.sequence[i] === undefined ? this.sequence[i] = [note.key] : this.sequence[i].push(note.key);
    } else {
      const index = this.sequence[i].findIndex(seq => seq === value.label);
      this.sequence[i].splice(index, 1);
      if (this.sequence[i].length === 0) delete this.sequence[i];
    }    
  }

  private initSequence(): void {
    [...Array(16).keys()].forEach(time => {
      this.part[time] = Object.values(gamme).map(note => {
        let checked = (Object.keys(this.sequence).includes(time.toString()) && this.sequence[time].includes(note.key));
        return { ...note, checked }
      })
    })
  }

}
