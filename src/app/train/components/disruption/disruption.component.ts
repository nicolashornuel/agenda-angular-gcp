import { Component, Input, OnInit } from '@angular/core';
import { SncfService } from 'app/train/services/sncf.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-disruption',
  templateUrl: './disruption.component.html',
  styleUrls: ['./disruption.component.scss']
})
export class DisruptionComponent implements OnInit {
  @Input() disruptionId!: string;
  public isLoading!: boolean;
  public message!: string;

  constructor(private sncfService: SncfService) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.sncfService
      .getDisruption(this.disruptionId)
      .pipe(take(1))
      .subscribe(disruption => {
        this.message = disruption.message
        this.isLoading = false;
      });
  }
}
