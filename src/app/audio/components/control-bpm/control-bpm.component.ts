import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '@shared/services/destroy.service';
import { BpmService } from '../../services/bpm.service';

@Component({
  selector: 'app-control-bpm',
  templateUrl: './control-bpm.component.html',
  styleUrls: ['./control-bpm.component.scss']
})
export class ControlBpmComponent implements OnInit {
  bpm!: number;
  isRunning = false;

  constructor(private bpmService: BpmService, private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.bpmService.getBpm$
      .pipe(
        tap((bpm: number) => (this.bpm = bpm)),
        map((bpm: number) => 15000 / bpm),
        tap((duration: number) => this.bpmService.setDuration$(duration / 1000)),
        switchMap((duration: number) => interval(duration)),
        takeUntil(this.destroy$)
      )
      .subscribe((counter: number) => {
        this.isRunning ? this.bpmService.setCurrent$(counter % 16) : this.bpmService.setCurrent$(-1)});
  }

  onBpmChange(): void {
    this.bpmService.setBpm$(this.bpm);
  }
}
