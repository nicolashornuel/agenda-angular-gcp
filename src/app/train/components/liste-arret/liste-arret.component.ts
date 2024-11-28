import { Component, Input, OnInit } from '@angular/core';
import { SncfService } from 'app/train/services/sncf.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-liste-arret',
  templateUrl: './liste-arret.component.html',
  styleUrls: ['./liste-arret.component.scss']
})
export class ListeArretComponent implements OnInit {
  @Input() trajetId!: string;
  public arrets!: string[];
  public isLoading!: boolean;

  constructor(private sncfService: SncfService) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.sncfService
      .getJourneys(this.trajetId)
      .pipe(take(1))
      .subscribe(arrets => {
        this.arrets = arrets;
        this.isLoading = false;
      });
  }
}


